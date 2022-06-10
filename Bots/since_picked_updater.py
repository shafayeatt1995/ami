from pprint import pprint
import certifi
import sys
from bson.objectid import ObjectId
from pymongo import MongoClient

ca = certifi.where()

MONGO_URL = "mongodb+srv://footyamigo-sandbox:pGazD7iuKW1wwCSV@cluster0.aapbr.mongodb.net/footyamigo-sandbox?retryWrites=true&w=majority"
client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client["footyamigo-sandbox"]
picks_collection = database.picks
fixtures_collection = database.fixtures

if __name__ == "__main__":
    pick_pipline = [{
        "$match": {
            "fixture_id": 18304968, # just for testing, should be deleted
            "type": "in-play",
            "status": "sent",
            # "strike": None, # should uncomment
            # "user_id":
            # "strategy_id":
        }
    }, {
        "$lookup": {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "user",
        }
    }, {
        "$lookup": {
            "from": "strategies",
            "localField": "strategy_id",
            "foreignField": "_id",
            "as": "strategy",
        }
    }, {
        "$lookup": {
            "from": "fixtures",
            "localField": "fixture_id",
            "foreignField": "fixture_id",
            "as": "fixture",
        }
    }, {
        "$project": {
            "fixture": 1,
            "user.email": 1,
            "strategy.outcome": 1,
            "type": 1,
            "status": 1,
            "goals": 1,
            "minute": 1,
        }
    }]
    picks = picks_collection.aggregate(pick_pipline)

    for pick in picks:
        # pprint(pick)
        sent_time = pick["minute"]
        code = pick["strategy"][0]["outcome"]["code"] # o25_goals_sp
        fixture = pick["fixture"][0]

        print(sent_time, code)

        # home_goals_since_picked = len([x for x in fixture["result"]["goal_timings_home"] if x > sent_time])
        # away_goals_since_picked = len([x for x in fixture["result"]["goal_timings_away"] if x > sent_time])
        # total_goals_since_picked = len([x for x in fixture["result"]["goal_timings_all"] if x > sent_time])
        # total_goals_1h_since_picked = len([x for x in fixture["result"]["goal_timings_all"] if x >= sent_time and x <= 45])
        # total_goals_2h_since_picked = len([x for x in fixture["result"]["goal_timings_all"] if x >= sent_time and x > 45])

        # # home_corners_since_picked = len([x for x in fixture["result"]["corner_timings_home"] if x > sent_time])
        # # away_corners_since_picked = len([x for x in fixture["result"]["corner_timings_away"] if x > sent_time])
        # total_corners_since_picked = len([x for x in fixture["result"]["corner_timings_all"] if x > sent_time])
        # total_corners_1h_since_picked = len([x for x in fixture["result"]["corner_timings_all"] if x >= sent_time and x <= 45])
        # total_corners_2h_since_picked = len([x for x in fixture["result"]["corner_timings_all"] if x >= sent_time and x > 45])


        home_goals_at_pick = int(pick["goals"].split("-")[0])
        away_goals_at_pick = int(pick["goals"].split("-")[1])
        total_goals_at_pick = home_goals_at_pick + away_goals_at_pick

        total_corners_at_pick = int(pick["corners"].split("-")[0]) + int(pick["corners"].split("-")[1])

        home_goals_since_picked = fixture["result"]["home_goals"] - home_goals_at_pick
        away_goals_since_picked = fixture["result"]["away_goals"] - away_goals_at_pick
        total_goals_since_picked = fixture["result"]["total_goals"] - total_goals_at_pick
        total_goals_1h_since_picked = fixture["result"]["goals_1h"] - total_goals_at_pick # note: it is sometimes negative
        if sent_time <= 45:
            total_goals_2h_since_picked = fixture["result"]["goals_2h"]
        else:
            total_goals_2h_since_picked = total_goals_since_picked

        total_corners_since_picked = fixture["result"]["total_corners"] - total_corners_at_pick
        total_corners_1h_since_picked = fixture["result"]["corners_1h"] - total_corners_at_pick # note: it is sometimes negative
        if sent_time <= 45:
            total_corners_2h_since_picked = fixture["result"]["corners_2h"]
        else:
            total_corners_2h_since_picked = total_corners_since_picked


        res = dict()

        # goals

        for i in range(4):
            res[f"o{i}5_goals_sp"] = total_goals_since_picked > i
            res[f"u{i}5_goals_sp"] = total_goals_since_picked <= i

        for i in range(3):
            res[f"o{i}5_goals_1h_sp"] = total_goals_1h_since_picked > i
            res[f"o{i}5_goals_2h_sp"] = total_goals_2h_since_picked > i

            res[f"u{i}5_goals_1h_sp"] = total_goals_1h_since_picked <= i
            res[f"u{i}5_goals_2h_sp"] = total_goals_2h_since_picked <= i
        
        # btts
        
        res["btts_sp"] = home_goals_since_picked >= 1 and away_goals_since_picked >= 1
        res["btts_no_sp"] = home_goals_since_picked == 0 and away_goals_since_picked == 0

        # corners

        for i in range(7):
            res[f"o{i}5_corners_sp"] = total_corners_since_picked > i
            res[f"u{i}5_corners_sp"] = total_corners_since_picked <= i

        for i in range(4):
            res[f"o{i}5_corners_1h_sp"] = total_corners_1h_since_picked > i
            res[f"o{i}5_corners_2h_sp"] = total_corners_2h_since_picked > i

            res[f"u{i}5_corners_1h_sp"] = total_corners_1h_since_picked <= i
            res[f"u{i}5_corners_2h_sp"] = total_corners_2h_since_picked <= i
        
        # check outcome

        strike = res[code]
