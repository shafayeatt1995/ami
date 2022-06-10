from multiprocessing import Pool

import certifi

from datetime import timedelta, date
from prometheus_client import Counter


from pymongo import MongoClient

import boto3

s3 = boto3.client('s3')
bucket = "footyamigo-fixtures"

ca = certifi.where()
from bson import ObjectId
client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client.footyamigo
fixtures_col = database.fixtures
User = database.users
Strategy = database.strategies
Pick = database.picks
from collections import Counter
count = Counter()


def find_strategy_and_update_picks_sent(strategy):
    strategy_id = strategy["_id"]
    picks_sent = Pick.count_documents({'strategy_id': strategy_id})
    Strategy.find_one_and_update({"_id": strategy_id}, {"$set": {"picks_sent": picks_sent}})
    count["picks_sent"]+=1 
    print(count)
    # print(picks_sent)
    return picks_sent

strategies = Strategy.find({}, {"_id": 1})
if __name__ == '__main__':
    pool = Pool(processes=10)             
    print (pool.map(find_strategy_and_update_picks_sent, strategies) )       