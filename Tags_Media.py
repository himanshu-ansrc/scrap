from urllib.request  import urlopen
from bs4 import BeautifulSoup
import re
import csv
import sys
import importlib
import random
importlib.reload(sys)

#import easygui
import tkinter as tk
from tkinter import filedialog
root = tk.Tk()
root.withdraw()

import lxml
import lxml.html
import xlsxwriter
url = "file:///E:/Himanshu/scrap/13570164531143568829.html"
html = urlopen(url)
soup = BeautifulSoup(html, 'lxml')
type(soup)

rows = soup.findAll('tr', {'class': re.compile('tr*')})
# Create a workbook and add a worksheet.
workbook = xlsxwriter.Workbook(str(random.randint(1,101))+'.xlsx')
worksheet = workbook.add_worksheet()
bold = workbook.add_format({'bold': True})

data = "";
r = 1;
worksheet.write(0, 1, "TITLE", bold)
worksheet.write(0, 2, "QID", bold)

imageColymnsIndex = 13;

dataCol =3;
count = 3;
publicImgURI = './EZ';

for row in rows:
    attributes_dictionary = row.find(style="background: #ffe0e0")
    #title
    worksheet.write(r, 1, attributes_dictionary['value'])
    # #qid
    worksheet.write(r, 2, attributes_dictionary.find_next('b').text)

    tags_class = row.find_all(class_="ref")
    for tags in tags_class:
        tag = tags.find_all(style="text-align: right; vertical-align: bottom")
        repla = str(tag).replace("<br/>", ";")
        cleantext = BeautifulSoup(repla, "lxml").text
        data = list(cleantext.split(";"))
        dataCol=3
        # if (len(data)<10 and len(data)!=1):
        #     q = [];
        #     for p in range(10):
        #         q[p] = data[p]
        #     print (p)
        #for index, val in enumerate(data):
        for index, x in enumerate(data):
            y = list(x.split(":"))
            rowHeading = ''
            rowData = ''
            for z in y:
                if y.index(z)==0:
                    rowHeading = z.split(" ")[1]  if (len(z.split(" "))>1) else z.split(" ")[0]
                    worksheet.write(0, dataCol, rowHeading, bold)
                else:
                    rowData += z
                    if (rowHeading.lower()=="outcomes"):
                        rowData = rowData.replace(' ABET Outcomes', '')
                    if (rowHeading.lower()=="units"):
                        rowData = rowData.replace(']', '')
            if(rowHeading.lower()!="chapter" and dataCol==17):
                dataCol += 2
                worksheet.write(r, dataCol, rowData)
            else:
                worksheet.write(r, dataCol, rowData)
            dataCol += 1

    questionContainerImg = row.find_all(class_="stemStyle", style="text-align: left")
    for x in questionContainerImg:
        #links = x.find_all('img', {'class': 'external_media_item'});
        links = x.find_all('img');
        if len(links)>0:
            l = 0;
            for k in links:
                if k.parent.name == 'td':
                    if 'mcCell' in k.parent['class']:
                        continue
                y = k['src'].split('.')[1]
                ext = "."+k['src'].split('.')[-1]
                if(ext=='.tp4'):
                    ext = '.png'
                worksheet.write(0, imageColymnsIndex+l, "IMAGE"+str(l+1), bold)
                worksheet.write(r, imageColymnsIndex+l , publicImgURI+y+ext)
                l=l+1;
        count = count+1;
    r=r+1

workbook.close()
