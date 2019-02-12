import os,sys
folderForImages = '\EZ'
dir_path = os.path.dirname(os.path.realpath(__file__))+folderForImages;

for filename in os.listdir(dir_path):
    infilename = os.path.join(dir_path,filename)
    oldbase = os.path.splitext(filename)
    if (oldbase[1]=='.tp4'):
        newname = infilename.replace('.tp4', '.png')
        output = os.rename(infilename, newname)
