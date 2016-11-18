


import csv

from pattern.web import URL, DOM

TARGET_URL = "https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_population_density"
# BACKUP_HTML = 'tvseries.html'
# OUTPUT_CSV = 'tvseries.csv'

url = URL(TARGET_URL)
print(url)
# print type(url)
dom = DOM(url.download())


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # takes all items with given class
    dom_serie = dom.by_class('lister-item.mode-advanced')
    # creates counter for iteration through dom_serie. I have tried to use a for loop, this did not work.
    count = 0
    # create empty to store elements
    all_series = []
    while count < len(dom_serie):
        # take the count amount of serie
        dom_series = dom_serie[count]
        # take title
        dom_title = dom_series.by_class('lister-item-header')[0].by_tag('a')[0][0]
        # take rating
        dom_rating = dom_series.by_class('inline-block')[0].by_tag('strong')[0][0]
        # take genre, remove the enter, and strip the empty space on the end
        dom_genre = dom_series.by_class('genre')[0].content
        dom_genre = str(dom_genre)
        dom_genre = dom_genre.rstrip()
        dom_genre = dom_genre[1:]
        # take runtime and strip min
        dom_runtime = dom_series.by_class('runtime')[0][0]
        dom_runtime = str(dom_runtime)
        dom_runtime = dom_runtime[:-3]
        stars = dom_series.by_tag('a')
        # create empty array to store stars
        dom_stars = []
        # create a switch that enables an appending when a value has been reached
        switch = 0
        # iterate through all elements with tag 'a'
        for i in stars:
            # this is the element after the actors
            if (i[0]) == dom_series.by_class('inline-block')[0].by_tag('strong')[0]:
                break
            # when element befor actors is reached
            if switch == 1:
                dom_stars.append(i.content.encode('ASCII', 'ignore'))
            # when elements == element befor actors, turn appendswitch on
            if str(i[0]) == '<span>X</span>':
                switch = 1
        # store all variables in series
        series = [dom_title, dom_rating, dom_genre]
        # unlists the list and puts the individual elements in series
        series.extend(dom_stars)
        # append runtime
        series.append(dom_runtime)
        # increase counter to go to next serie
        count += 1
        # append serie in meta-file
        all_series.append(series)
    # return all series to function
    return all_series
