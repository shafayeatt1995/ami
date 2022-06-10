/*

TasK: Convert python to JS

import json
import os
import logging
import traceback
from datetime import datetime, timedelta
import time
import certifi
from pymongo import MongoClient
from bson import ObjectId
from collections.abc import MutableMapping

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ca = certifi.where()
client = MongoClient(MONGO_URL, tlsCAFile=ca)
footyamigo = client["footyamigo"]
fixtures_table = footyamigo["fixtures"]
Pick = footyamigo["picks"]
strategies_table = footyamigo["strategies"]
errors_table = footyamigo["errors"]

REQUIRED_SELECT = ["id",
                   "league_id",
                   "season_id",
                   "home_id",
                   "away_id",
                   "home_name",
                   "away_name",
                   "timestamp",
                   "status",
                   "league_name",
                   "country_name",
                   "iso",
                   "flag_emoji",
                   "minute",
                   "extra_minute",
                   "pre_odds.draw",
                   "pre_odds.home_win",
                   "pre_odds.away_win",
                   "goals_json"]
comparators = {
    "<": "$lt",
    ">": "$gt",
    "=": "$eq",
    "!=": "$ne",
    "<=": "$lte",
    ">=": "$gte",
}


def flatten(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, MutableMapping):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


class PreMatchStrategyBot:

    def __init__(self):
        pass

    @staticmethod
    def gen_condition(field, operator, value):
        sign = comparators[operator]
        return {field: {sign: float(value)
                        }}

    @staticmethod
    def gen_between_condition(field, values):
        x = values[0]
        y = values[1]
        return {field: {"$gte": x, "$lte": y}}

    def __condition_for_probability(self, rule):
        table_name = "probability"
        column_name = rule["code"]
        field = f"{table_name}.{column_name}"
        return [self.gen_between_condition(field, rule["values"])], [field]

    def __condition_for_team(self, rule, team):
        if rule["category"] == "h2h":
            table_name = f"{team}_h2h"
        else:
            table_name = team
        if rule.get("direct"):
            column_name = rule["code"]
        else:
            column_name = rule[rule["location"]]

        field = f"{table_name}.{column_name}"
        return self.gen_between_condition(field, rule["values"]), field

    def __condition_for_odds(self, rule):
        table_name = "pre_odds"
        column_name = rule["code"]
        operator = rule["comparator"]
        value = rule["value"]
        field = f"{table_name}.{column_name}"
        return (
            [self.gen_condition(field, operator, value)], [field]
        )

    def __condition_for_aggregate_stats(self, rule):
        if rule["team"] in ["home", "away"]:
            condition, field = self.__condition_for_team(rule, rule["team"])
            conditions = [condition]
            fields = [field]
        else:
            condition_1, field_1 = self.__condition_for_team(
                rule, "home")
            condition_2, field_2 = self.__condition_for_team(rule, "away")
            conditions = [condition_1, condition_2]
            fields = [field_1, field_2]
            if rule["team"] == "either":
                conditions = [{"$or": conditions}]
        return conditions, fields

    def __query_for_pre_match_rules(self, strategy):
        pre_match_conditions = []
        pre_match_fields = []
        for rule in strategy["strategy_prematch_rules"]:
            if rule["category"] == "probability":
                conditions, fields = self.__condition_for_probability(rule)
            elif rule["category"] == "odds":
                conditions, fields = self.__condition_for_odds(rule)
            else:
                conditions, fields = self.__condition_for_aggregate_stats(rule)
            pre_match_conditions += conditions if isinstance(
                conditions, list) else [conditions]
            pre_match_fields += fields
        return pre_match_conditions, pre_match_fields
        # return " \nAND\n ".join(pre_match_conditions), pre_match_fields

    @staticmethod
    def __query_timer(strategy):
        timer = strategy["timer"]
        minute = timer.get("minute")

        time_after_one_and_half_hour = datetime.utcnow() + timedelta(hours=1.5)
        time_after_one_and_half_hour_unix = int(time.mktime(time_after_one_and_half_hour.timetuple()))

        after_timer_minutes = datetime.utcnow() + timedelta(minutes=minute)
        after_timer_minutes_unix = int(
            time.mktime(after_timer_minutes.timetuple()))

        query_item = {"timestamp": {
            "$gte": after_timer_minutes_unix, "$lte": time_after_one_and_half_hour_unix}}

        return query_item

    @staticmethod
    def __query_for_leagues(strategy):

        return {"league_id": {"$in": strategy["leagues"]}}

    def set_pickle(self, fixture, strategy):
        sending_time = int(fixture['timestamp']) - \
            (int(strategy['timer']['minute']) * 60)

        Pick.update_one(
            {"fixture_id": fixture['id'],
             "strategy_id": ObjectId(strategy['_id']),
             }, {"$set":  {
                 "user_id": ObjectId(strategy['user_id']),
                 "league_id": fixture["league_id"],
                 "type": "pre-match",
                 "status": "waiting",
                 "home_name": fixture["home_name"],
                 "away_name": fixture["away_name"],
                 "is_public": strategy["is_public"],
                 "minute": strategy['timer']['minute'],
                 "extra_minute": None,
                 "sending_time": sending_time,
                 "_fixture_id": str(fixture['_id']),
                 "_strategy_id": str(strategy['_id']),
                 "created_at": datetime.utcnow(),
                 "updated_at": datetime.utcnow()
             }}, upsert=True)

    def convert_strategy_and_find_fixtures(self, strategy):
        try:
            picks = list(Pick.find(
                {"strategy_id": ObjectId(strategy["_id"]), 'status': {'$ne': 'aborted'}}, {"fixture_id": 1}))
            pre_match_conditions, pre_match_fields = self.__query_for_pre_match_rules(
                strategy)
            timer_conditions = [self.__query_timer(strategy)]
            # extra_conditions = [{"status": {"$in": ['LIVE', 'HT', 'PEN_LIVE', 'BREAK', 'ET']}},]
            league_conditions = [self.__query_for_leagues(strategy)]

            WHERE = (pre_match_conditions +
                     timer_conditions + league_conditions)

            if picks:
                pick_ids = [x["fixture_id"] for x in picks]
                WHERE += [
                    {"fixture_id": {"$nin": pick_ids}}
                ]

            fields = pre_match_fields

            SELECT = fields.copy()
            SELECT += REQUIRED_SELECT

            query = [
                {"$match": {"$and": WHERE}},
                {"$project": {key: 1 for key in SELECT}}
            ]
            try:
                with open("query.json", "w") as f:
                    f.write(json.dumps(query, indent=2, default=str))
            except:
                pass
            print(query)

            fixtures = fixtures_table.aggregate(query)
           
            for fixture in fixtures:
                # print(json.dumps(fixture, indent=2, default=str))
                # continue
                self.set_pickle(fixture, strategy)

        except Exception as ex:
            logger.error('An error occurred on %s', strategy["id"])
            logger.error(traceback.format_exc())
            errors_table.insert_one(
                {"strategy": strategy, "message": str(ex), "time": datetime.now(), "lambda": "pre-match-strategy-executer"})


def lambda_handler(event, context):
    print(event)

    for rec in event['Records']:
        data = json.loads(rec['body'])
        # print(data)
        bot = PreMatchStrategyBot()
        bot.convert_strategy_and_find_fixtures(strategy=data)

    return {
        'statusCode': 200,
        'body': ''
    }
*/



class PreMatchStrategyBot {
    constructor() {
        this.__fixtures_table = fixtures_table;
        this.__errors_table = errors_table;
        this.__picks_table = picks_table;
        this.__strategies_table = strategies_table;
        this.__users_table = users_table;
    }

    __query_for_probability(rule) {
        let condition, field;
        if (rule["team"] == "home" || rule["team"] == "away") {
            condition, field = this.__condition_for_team(rule, rule["team"]);
        } else {
            condition_1, field_1 = this.__condition_for_team(rule, "home");
            condition_2, field_2 = this.__condition_for_team(rule, "away");
            condition = { "$or": [condition_1, condition_2] };
            field = [field_1, field_2];
            if (rule["team"] == "either") {
                condition = { "$or": [condition] };
            }
        }
        return [condition], [field];
    }

    __query_for_odds(rule) {
        let condition, field;
        if (rule["team"] == "home" || rule["team"] == "away") {
            condition, field = this.__condition_for_team(rule, rule["team"]);
        } else {
            condition_1, field_1 = this.__condition_for_team(rule, "home");
            condition_2, field_2 = this.__condition_for_team(rule, "away");
            condition = { "$or": [condition_1, condition_2] };
            field = [field_1, field_2];
            if (rule["team"] == "either") {
                condition = { "$or": [condition] };
            }
        }
        return [condition], [field];
    }

    __query_for_aggregate_stats(rule) {
        let condition, field;
        if (rule["team"] == "home" || rule["team"] ==
            "away") {
            condition, field = this.__condition_for_team(rule, rule["team"]);
        }
        else {
            condition_1, field_1 = this.__condition_for_team(rule, "home");
            condition_2, field_2 = this.__condition_for_team(rule, "away");
            condition = { "$or": [condition_1, condition_2] };
            field = [field_1, field_2];
            if (rule["team"] == "either") {
                condition = { "$or": [condition] };
            }
        }
        return [condition], [field];

    }
    
}