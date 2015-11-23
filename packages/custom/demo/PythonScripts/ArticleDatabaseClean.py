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
        #if text_data['status'] != 'OK':
        #    print "Oops! There was a problem with AlchemyAPI.\nYou may have exceeded your transaction limit."
        #    quit()

        rest_caller.update(ids, {"content":text_data['text']})