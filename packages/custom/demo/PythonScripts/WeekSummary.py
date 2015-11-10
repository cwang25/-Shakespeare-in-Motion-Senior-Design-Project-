"""
Created on Oct 26, 2015

@author: hans wang
"""
from RestCall import RestCaller
import RestCall
import urllib2
import urllib
import json
import argparse
import time

article_url = "http://localhost:3000/api/demo/newsarticles"
quote_url = "http://localhost:3000/api/demo/quotes"
week_sum_url = "http://localhost:3000/api/demo/weekSum"

#
# class WeekSum:
#     def __init__(self):
#         pass


def get_article_list_by_date_range(startdate, enddate):
    articles = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/newsbydaterange?startdate="+startdate + "&enddate=" + enddate).json()
    return articles


def get_week_summaries(date):
    week_sum = RestCall.send_raw_request("get",
                                         "http://localhost:3000/api/demo/weeksum_by_date?date=" + date).json()
    return week_sum


def get_quotes_list():
    quote_rest = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/quotes_by_symbol?indexsymbol=^DJC")
    quotes = quote_rest.json()
    for q in quotes:
        print q
    return quotes


def generate_summary(articles, quotes):
    summary = {

    }
    first_q = quotes[0];
    last_q = quotes[-1];
    start_date = first_q["qdate"];
    end_date = last_q["qdate"];
    return None


def main():
    quotes = get_quotes_list()
    first_q = quotes[0];
    last_q = quotes[-1];
    start_date = first_q["qdate"];
    end_date = last_q["qdate"];
    print start_date
    print end_date

if __name__ == '__main__':
    main()