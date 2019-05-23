from flask import Flask, render_template, request, jsonify
import json


app = Flask(__name__)


@app.route('/')
def index():
    with open("./static/data/basic_data_processed.json", 'r') as load_f:
        load_dict = json.load(load_f)
        people = load_dict
    with open('./static/data/china-geo.json', 'r') as load_m:
        load_map = json.load(load_m)
        china = load_map
    return render_template('index.html', people=people, china=china)


@app.route("/people/<string:person_name>")
def people(person_name):
    a = u'./static/data/person/'+person_name+'.csv'
    ls = []
    with open(a, 'r') as fo:
        for line in fo:
            line = line.replace("\n", "")
            ls.append(line.split(","))
        for i in range(1, len(ls)):
            ls[i] = dict(zip(ls[0], ls[i]))
    return jsonify(ls[1:])


if __name__ == '__main__':
    app.run()


