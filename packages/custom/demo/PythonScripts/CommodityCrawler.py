"""
Created on Sep 21, 2015

@author: hans wang
"""
import requests
import urllib2, urllib, json
import argparse
import time
# import json

clientid = "dj0yJmk9MW9ybDhrZUd0MkdUJmQ9WVdrOWJuWktZVXd4TXpBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kNQ--"
clientSecret = "32a2b5f6cffb894566efd3ec7eb61871fd7a22c8"
indexes_list = None
mean_server_url = "http://localhost:3000/api/demo/quotes"


def parse_arguments():
    parser = argparse.ArgumentParser(description='Commodity Index Crawler')
    parser.add_argument('-start', dest='startdate', metavar='startdate', type=str, help='start date of the commodity')
    parser.add_argument('-end', dest='enddate', metavar='enddate', type=str, help='end date of the commodity')
    parser.add_argument('-daily', dest='daily', help='check commodity every day')
    parser.add_argument('-index', dest='index', metavar='index', type=str, help='index symbol')
    return parser.parse_args()


def print_how_to():
    print "usage 1: -start -end -index"
    print "usage 2: -daily -index"
    print "-start : start date for retrieving historical indexes from"
    print "-end : end date for retrieving historical indexes"
    print "-daily : if scripts has to routinely running and check given index everyday."
    print "-index : the index to lookup, the symbol of the index on Yahoo. i.e. Dow Jones Index => ^DJI"
    print "-index support multiple index symbol inputs by separating by ','"
    print "i.e. YHOO,^DJI,BBRY  for yahoo, don jones, and blackberry"


def daily_process():
    pass


def historical_data_process(start, end):
    for index in indexes_list:
        quote = yql_query(index, start, end)
    pass

def yql_query(symbol, start=time.strftime("%Y-%m-%d"), end=time.strftime("%Y-%m-%d")):
    baseurl = "https://query.yahooapis.com/v1/public/yql?"
    yql_query = 'SELECT * FROM yahoo.finance.historicaldata WHERE symbol='+symbol+' and startDate='+start+' and endDate='+end
    yql_url = baseurl + urllib.urlencode({'q':yql_query}) + "&format=json&env=http://datatables.org/alltables.env"
    #print yql_url
    result = urllib2.urlopen(yql_url).read()
    data = json.loads(result)
    #print data['query']['results']
    print urllib.unquote(data['query']['results']['quote'][0]['Symbol'])
    return data['query']['results']['quote']

def init():
    global indexes_list
    args = parse_arguments()
    if args.index is None:
        print_how_to()
        quit()
    if(args.daily is None) and (args.start is not None and args.end is not None):
        indexes_list = args.index.split(',')
        historical_data_process(args.start, args.end)
    elif args.daily is not None and (args.start is None and args.end is None):
        indexes_list = args.index.split(',')
        daily_process()
    else:
        print_how_to()
        quit()


def main():


    print time.strftime("%Y-%m-%d")
if __name__ == '__main__':
    main()
