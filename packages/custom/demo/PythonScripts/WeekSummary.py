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


class WeekSum:
    def __init__(self):
        pass


class DataCollector:
    article_rest = RestCaller(article_url)
    quote_rest = RestCaller(quote_url)
    week_sum_rest = RestCaller(week_sum_url)
    quotes_list = None
    def __init__(self):
        print "hi"

    def get_article_list_by_date_range(self):
        return None

    def get_week_summaries(self):
        return None

    def get_quotes_list(self):
        return None

    def generate_summary(self):
        return None


def main():
    print "Parameter in constructor allows to customize the API enpoint that the script is connecting to."


if __name__ == '__main__':
    main()