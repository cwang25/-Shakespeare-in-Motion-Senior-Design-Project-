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

id_list = dict()
rest_caller = None

s = requests.Session()

def alchemy_text_extraction(id_list_here):
    global rest_caller
    for ids in id_list_here:
        news_url = id_list_here[ids]
        textURL = 'http://gateway-a.watsonplatform.net/calls/url/URLGetText?' \
                 'url='+news_url+\
                 '&apikey='+api_key_2+\
                 '&outputMode=json' \
                 '&useMetadata=0'
        post_data = bytearray()
        r = s.get(url=textURL, data=post_data)

        text_data = json.loads(r.text)
        rest_caller.update(ids, {"content":text_data['text']})

def init():
    global rest_caller
    rest_caller = RestCaller(mean_server_url)
    r = rest_caller.get()
    text_data = json.loads(r.text)
    missing_content = dict()
 
    for data in text_data:
        if "Full text not available. Please use associated URL to view full text:" in data['content']:
            missing_content[data['_id']] = data['url']
        else:
            continue

    if missing_content:
        alchemy_text_extraction(missing_content)
        print "\n\n"

    else:
        print "No text extractions needed!"

def main():
    init()

if __name__ == '__main__':
    main()