#!/usr/bin/env python
# Name: Chris de Rijcke
# Student number: 10645012
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
And nothing is missing, everything works!
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

url = URL(TARGET_URL)
print(url)
#print type(url)
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
    #creates counter for iteration through dom_serie. I have tried to use a for loop, this did not work.
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
                dom_stars.append(i.content.encode('ASCII','ignore'))
            # when elements == element befor actors, turn appendswitch on
            if str(i[0]) == '<span>X</span>':
                switch = 1
        # store all variables in series
        series = [dom_title,dom_rating,dom_genre]
        # unlists the list and puts the individual elements in series
        series.extend(dom_stars)
        # append runtime
        series.append(dom_runtime)
        # increase counter to go to next serie
        count+=1
        # append serie in meta-file
        all_series.append(series)
    # return all series to function
    return all_series
        
    

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    # iterate through all arrays of series
    for i in tvseries:
        # writes the arrays into file
        writer.writerow(i)

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)