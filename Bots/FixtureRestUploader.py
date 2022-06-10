import requests
import certifi
import time
import sys
from datetime import timedelta, date
import datetime
import os
from multiprocessing import Pool
from variables import COUNTRIES, MONGO_URL
import json
import threading
import numpy
from sportmonks import SportMonksAPI
from pymongo import MongoClient
import pandas as pd
import boto3
from fixture_formatter import FixtureFormatter
s3 = boto3.client('s3')
bucket = "footyamigo-fixtures"

formatter = FixtureFormatter()

ca = certifi.where()

client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client.footyamigo
fixtures_col = database.fixtures

bucket = "footyamigo-fixtures"
nan = None


class FixtureUploader:

    def __init__(self):
        self.api = SportMonksAPI()
        self.includes = ["goals",
                         "cards",
                         "corners",
                         "stats",
                         "localTeam",
                         "visitorTeam",
                         "league.country",
                         "events"]
        self.chunk_size = 40

        self.time_delay_in_seconds = 1.5

    def uploadFixtures(self, ids):
        include = ",".join(self.includes)
        ids = ",".join(map(str, ids))
        if not ids:
            return None
        try:
            start_time = time.time()
            res = requests.get(
                "https://xqpq30njwk.execute-api.us-east-1.amazonaws.com/v1/fixtures?ids="+ids+"&include="+include)
            if res.status_code != 200:
                print(res.json(), ids)
                raise ValueError(res["message"])
            end_time = time.time()
            # time taken in seconds
            time_taken = end_time - start_time
            print(f"Time taken: {time_taken} seconds")
        except Exception as e:
            with open("errors.txt", "a") as f:
                f.write(ids+"\n")

    def asyncUploadFixtures(self, fixture_ids):
        print("Task started for", fixture_ids)
        threading.Thread(target=self.uploadFixtures,
                         args=(fixture_ids, )).start()

    def findFixturesByDateAndUpload(self, date):
        formatted_date = date.strftime("%Y-%m-%d")
        page = 1
        print("Finding fixtures for", formatted_date)
        while True:
            res = self.api.get_fixtures_by_date(formatted_date, page, [])
            print(
                f"\nPage {res['current_page']} out of {res['total_pages']}")
            fixtures = res["data"]
            i = 0

            while True:
                chunk = fixtures[i:i+self.chunk_size]
                if not len(chunk):
                    break
                ids = [fixture["id"] for fixture in chunk]
                self.uploadFixtures(ids)
                i += self.chunk_size
            if res["total_pages"] == res["current_page"]:
                break
            else:
                page += 1

    def retryFailedUploads(self):
        with open("errors.txt", "r") as f:
            lines = f.read().splitlines()
            for line in lines:
                ids = line.split(",")
                # divide ids in 2 parts
                ids1 = ids[:len(ids)//2]
                ids2 = ids[len(ids)//2:]
                self.uploadFixtures(ids1)
                self.uploadFixtures(ids2)
        os.remove("errors.txt")


if __name__ == "__main__":
    def gen_dates(start_date, end_date):
        one_day = timedelta(days=1)
        while start_date < end_date:
            yield start_date
            start_date += one_day
    uploader = FixtureUploader()
    error_mode = True
    if error_mode:
        uploader.retryFailedUploads()
    else:
        start_date = date(2012, 1, 1)
        end_date = date.today()
        dates = gen_dates(start_date, end_date)
        NO_OF_POOLS = 10

        pool = Pool(NO_OF_POOLS)
        with pool as p:
            p.map(uploader.findFixturesByDateAndUpload, dates)


