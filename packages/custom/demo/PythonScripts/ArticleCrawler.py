__author__ = 'hanswang'
from RestCall import RestCaller
from alchemyapi_python.alchemyapi import AlchemyAPI
import urllib2
import urllib
import json
import argparse
import time
import RestCall
import requests
import datetime


mean_server_url = "http://localhost:3000/api/demo/articles"
api_key_1 = "7ed25a35adda3ae7dac5d889e70927c7410937f8"
api_key_2 = "280db58834a1809dff4890e4c64eec5f266766e3"
s = requests.Session()


def alchemy_news_crawler_today(searchText):
    alchemyURL = 'http://gateway-a.watsonplatform.net/calls/data/GetNews?' \
                 'apikey='+api_key_2+\
                 '&outputMode=json' \
                 '&start=now-1d&end=now' \
                 '&maxResults=1' \
                 '&q.enriched.url.title='+searchText+\
                 '&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=finance'\
                 '&return=enriched.url.url,enriched.url.enrichedTitle.docSentiment,enriched.url.title,enriched.url.enrichedTitle.entities,enriched.url.keywords'
    post_data = bytearray()
    r = s.get(url=alchemyURL, data=post_data)
    print alchemyURL
    print "---"
    print r.text
    return r.json()


def alchemy_news_crawler(searchText, startdate, enddate):
    timestamp_start = (datetime.datetime.strptime(startdate, "%Y-%m-%d") - datetime.datetime(1970, 1, 1)).total_seconds()
    timestampe_end = (datetime.datetime.strptime(enddate, "%Y-%m-%d") - datetime.datetime(1970, 1, 1)).total_seconds()
    alchemyURL = 'http://gateway-a.watsonplatform.net/calls/data/GetNews?' \
                 'apikey='+api_key_2 +\
                 '&outputMode=json' \
                 '&start='+str(int(timestamp_start))+'&end='+str(int(timestampe_end)) +\
                 '&maxResults=1' \
                 '&q.enriched.url.title='+searchText +\
                 '&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=finance'\
                 '&return=enriched.url.url,enriched.url.enrichedTitle.docSentiment,enriched.url.title,enriched.url.enrichedTitle.entities,enriched.url.keywords'
    post_data = bytearray()
    r = s.get(url=alchemyURL, data=post_data)
    print alchemyURL
    print "---"
    print r.text
    return r.json()


def extract_features_from_url(url):
    pass

def extract_features_from_text(content):
    pass

def store_atricle_to_mean(data):
    pass


def ibm_json_to_infusion(article):
    pass

def parse_arguments():
    """
    Parse the command line arguement.
    :return:
    """
    parser = argparse.ArgumentParser(description='Commodity Index Crawler')
    parser.add_argument('-start', dest='startdate', metavar='startdate', type=str, help='start date of the commodity')
    parser.add_argument('-end', dest='enddate', metavar='enddate', type=str, help='end date of the commodity')
    parser.add_argument('-daily', dest='daily', action='store_true', help='check commodity every day')
    parser.add_argument('-index', dest='index', metavar='index', type=str, help='index symbol')
    return parser.parse_args()


def print_how_to():
    """
    Print the usage instruction
    :return:
    """
    print "usage 1: -start -end -index"
    print "usage 2: -daily -index"
    print "-start : start date for retrieving historical indexes from"
    print "-end : end date for retrieving historical indexes"
    print "-daily : if scripts has to routinely running and check given index everyday."
    print "-index : the index to lookup, the symbol of the index on Yahoo. i.e. Dow Jones Index => ^DJI"
    print "-index support multiple index symbol inputs by separating by ','"
    print "i.e. YHOO,^DJI,BBRY  for yahoo, don jones, and blackberry"


def init():
    global indexes_list
    global rest_caller
    args = parse_arguments()
    if args.index is None:
        print_how_to()
        quit()
    if(args.daily is False) and (args.startdate is not None and args.enddate is not None):
        rest_caller = RestCaller(mean_server_url)
        indexes_list = args.index.split(',')
    elif args.daily is True and (args.startdate is None and args.enddate is None):
        rest_caller = RestCaller(mean_server_url)
        indexes_list = args.index.split(',')
    else:
        print_how_to()
        quit()


def main():
    jsonObj = alchemy_news_crawler("gold", "2015-11-02", "2015-11-03")
    print jsonObj["totalTransactions"]

if __name__ == '__main__':
    main()