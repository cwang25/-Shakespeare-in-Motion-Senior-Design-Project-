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

mean_server_url = "http://localhost:3000/api/demo/newsarticles"
api_key_1 = "7ed25a35adda3ae7dac5d889e70927c7410937f8"
api_key_2 = "280db58834a1809dff4890e4c64eec5f266766e3"
api_key_3 = "9cc7412d4925c54e7aeb182be79018a40ee56a35"
commodity_list = None
s = requests.Session()
rest_caller = None

def obtain_articles_someday(start, end):
    """
    For reqeusting news articles
    store to mongo db.
    :param start: start date
    :param end: end date
    :return:
    """
    global commodity_list
    global rest_caller
    rest_caller = RestCaller(mean_server_url)
    for commodities in commodity_list:
        raw_list = alchemy_news_crawler(commodities, start, end)
        converted_list = convert_to_Infusion_JSON_list(raw_list)
        for item in converted_list:
            rest_caller.post(item)
'''

def alchemy_news_crawler_today(searchText):
    alchemyURL = 'http://gateway-a.watsonplatform.net/calls/data/GetNews?' \
                 'apikey='+api_key_1+\
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
    data = json.loads(r.json())
    return data
'''

def alchemy_news_crawler(searchText, startdate, enddate):
    timestamp_start = (datetime.datetime.strptime(startdate, "%Y-%m-%d") - datetime.datetime(1970, 1, 1)).total_seconds()
    timestampe_end = (datetime.datetime.strptime(enddate, "%Y-%m-%d") - datetime.datetime(1970, 1, 1)).total_seconds()
    alchemyURL = 'http://gateway-a.watsonplatform.net/calls/data/GetNews?' \
                 'apikey='+api_key_2 +\
                 '&outputMode=json' \
                 '&start='+str(int(timestamp_start))+'&end='+str(int(timestampe_end)) +\
                 '&maxResults=2' \
                 '&q.enriched.url.title='+searchText +\
                 '&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=finance'\
                 '&return=enriched.url.url,enriched.url.publicationDate.date,enriched.url.enrichedTitle.docSentiment,enriched.url.text,enriched.url.title,enriched.url.enrichedTitle.entities,enriched.url.keywords'
    post_data = bytearray()
    r = s.get(url=alchemyURL, data=post_data)
    print alchemyURL
    print "---"
    print r.json()
    data = json.loads(r.text)


    news_url = data['result']['docs'][0]['source']['enriched']['url']['url']
    alchemyURL2 = 'http://gateway-a.watsonplatform.net/calls/url/URLGetText?' \
                 'url='+news_url+\
                 '&apikey='+api_key_2 +\
                 '&outputMode=json' \
                 '&useMetadata=0'
    post_data2 = bytearray()
    r2 = s.get(url=alchemyURL2, data=post_data2)
    text_data = json.loads(r2.text)['text']
    data['result']['docs'][0]['source']['enriched']['url']['text'] = text_data

    return data
    #return r.json()


def convert_to_Infusion_JSON_list(raw_news):
    """
    Convert JSON list from Alchemy into our mean server's json format.
    :param raw_quotes:
    :return:
    """
    converted_list = []
    #print raw_news
    if raw_news is not None:
        if isinstance(raw_news, list):
            for q in raw_news:
                converted_list.append(json_alchemy_to_Infusion(q))
        else:
            converted_list.append(json_alchemy_to_Infusion(raw_news))
    return converted_list


def json_alchemy_to_Infusion(news):
    """
    Convert JSON object into our JSON format from yahoo server.
    :param quote:
    :return: Formatted JSON.
    """
    # date time string is in different format
    # has to parse it separately
    timetext = time.strptime(news['result']['docs'][0]['source']['enriched']['url']['publicationDate']['date'],"%Y%m%dT%H%M%S")
    #parsed_date = time.strptime(timetext, "%a %b %d %Y %H:%M:%S "+timetext[-14:])
    datestr_for_infusion = time.strftime("%Y-%m-%d", timetext)

    data = {
        "newsDate":datestr_for_infusion,
        "title":news['result']['docs'][0]['source']['enriched']['url']['title'],
        "content":news['result']['docs'][0]['source']['enriched']['url']['text'],
        "url":news['result']['docs'][0]['source']['enriched']['url']['url'],
        "keywords":news['result']['docs'][0]['source']['enriched']['url']['keywords'][0]['text'],
        "entities":news['result']['docs'][0]['source']['enriched']['url']['enrichedTitle']['entities'],
        "sentiment":news['result']['docs'][0]['source']['enriched']['url']['enrichedTitle']['docSentiment']['score']
    }
    print "\n\n\n\n"

    print data
    print "\n\n\n\n"
    return data

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
    parser.add_argument('-commodity', dest='commodity', metavar='commodity', type=str, help='commodity')
    return parser.parse_args()


def print_how_to():
    """
    Print the usage instruction
    :return:
    """
    print "usage 1: -start -end -commodity"
    print "usage 2: -start -end -commodity -result_amount"
    print "-start : start date for retrieving news articles, format YYYY-MM-DD"
    print "-end : end date for retrieving news articles, format YYYY-MM-DD"
    print "-result_amount : number of news articles you would like to return"
    print "-commodity : the commodity to lookup, formatted in plain english and surrounded by quotation marks"
    print "-commodity can support multiple commodities by separating by ','"
    print "i.e. oil,gold for oil and gold commodities"


def init():
    global commodity_list
    global rest_caller
    args = parse_arguments()
    if args.commodity is None:
        print_how_to()
        quit()
    if(args.startdate is not None and args.enddate is not None):
        rest_caller = RestCaller(mean_server_url)
        commodity_list = args.commodity.split(',')
        obtain_articles_someday(args.startdate, args.enddate)
    else:
        print_how_to()
        quit()


def main():
    global commodity_list
    init()

if __name__ == '__main__':
    main()