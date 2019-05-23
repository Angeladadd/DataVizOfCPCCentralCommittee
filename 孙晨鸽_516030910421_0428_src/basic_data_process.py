# -*- coding: UTF-8 -*-
import csv
import json
import jieba


csv_read = csv.reader(open('./static/data/basic_data.csv', 'r'))

jieba.add_word('工业工程')
jieba.add_word('思想政治')
jieba.add_word('国际关系学')
jieba.add_word('高级工程师')
jieba.add_word('经济管理')
jieba.del_word('医学博士')
jieba.del_word('法学博士')
jieba.del_word('法学硕士')


person_list = []

for person in csv_read:
    if len(person) == 1:
        continue
    if person[0] == 'name':
        person.append('province')
        person.append('year')
        person.append('month')
        person.append('school1')
        person.append('school2')
        person.append('background_list')
        del person[6],person[5],person[4],person[3]
        person_list.append(person)
        continue
    province = person[3][:2]
    if province == '内蒙':
        province = '内蒙古'
    if province == '黑龙':
        province = '黑龙江'
    person.append(province)
    birth = person[4].split('年')
    person.append(birth[0])
    if len(birth)>1:
        if len(birth)>2:
            person.append(birth[1][:-1])
        else:
            person.append(birth[1][:-1])
    else:
        person.append('')
    if '.' in person[5]:
        school = person[5].split('.')
        person.append(school[0])
        person.append(school[1])
    else:
        person.append(person[5])
        person.append('')
    background_list = jieba.lcut(person[6])
    if '.' in background_list:
        background_list.remove('.')
    if '学历' in background_list:
        background_list.remove('学历')
    if '专业' in background_list:
        background_list.remove('专业')
    if '学' in background_list:
        background_list.remove('学')
    if '系' in background_list:
        background_list.remove('系')
    if '与' in background_list:
        background_list.remove('与')
    person.append(background_list)
    del person[6], person[5], person[4], person[3]
    person_list.append(person)
    # print(person)

csv_write = csv.writer(open('./static/data/basic_data_processed.csv', 'a', newline=''), dialect='excel')
for row in person_list:
    # del row[6],row[5],row[4],row[3]
    csv_write.writerow(row)

json_write = open('./static/data/basic_data_processed.json', 'w')
for i in range(1, len(person_list)):
    person_list[i] = dict(zip(person_list[0], person_list[i]))
json.dump(person_list[1:], json_write)
json_write.close()



