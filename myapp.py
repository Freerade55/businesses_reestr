

from flask import request, Flask, jsonify, g
from flask_cors import CORS
import pymysql
import os
from datetime import datetime
import pandas
from sqlalchemy import create_engine
from dadata import Dadata
import openpyxl




app = Flask(__name__)
CORS(app)


def connect_db():
    return pymysql.connect(
    host="mysql104.1gb.ru",
    user="gb_camera",
    password="FTwaEzf-xNdL",
    database = "gb_camera",
    cursorclass = pymysql.cursors.DictCursor
    )



def get_db():
    '''Opens a new database connection per request.'''
    if not hasattr(g, 'db'):
        g.db = connect_db()
    return g.db



@app.teardown_appcontext
def close_db(error):
    '''Closes the database connection at the end of request.'''
    if hasattr(g, 'db'):
        g.db.close()







@app.route('/get_xml', methods=['GET'])
def get_xml():
    global rsmp
    global rsmp_stat_federal_district
    rsmp = ''
    rsmp_stat_federal_district = ''

    app.config['INSTANCE_UPLOADS'] = f"C:/Users/Георгий/PycharmProjects/businesses_reestr"

    if request.method == 'GET' and '' in request.files:
        for f in request.files.getlist(''):
            f.save(os.path.join(app.config['INSTANCE_UPLOADS'], f.filename))
            if 'stat_federal_district' in f.filename:
                rsmp_stat_federal_district += f.filename
            else:
                rsmp += f.filename

    return jsonify()




@app.route('/entry_to_bd', methods=['POST'])
def entry_to_bd():
    request_data = request.get_json()
    user_request = {
        'date': request_data['date']

    }
    global data
    data = datetime.date(datetime.strptime(user_request['date'], '%d.%m.%Y'))

    my_conn = create_engine('mysql+pymysql://gb_camera:FTwaEzf-xNdL@mysql104.1gb.ru/gb_camera')
    file = rsmp
    ex = pandas.read_excel(file, sheet_name='Лист1')
    df = pandas.DataFrame(data = ex)
    df = df.rename(columns={
    f"""Единый реестр субъектов малого и среднего предпринимательства по состоянию на {'.'.join(rsmp_stat_federal_district.split('_')[-1].split('.')[:-1])}""":
    'Unnamed: 0'})

    df.to_sql(name='10_05_2022_all', con=my_conn, if_exists='append', index=False)



    return jsonify()



@app.route('/get_rayons', methods=['GET'])
def get_rayons():

    cursor = get_db().cursor()
    cursor.execute(
        f"""SELECT `Unnamed: 5` as inn FROM 10_05_2022_all
        WHERE `Unnamed: 8` IS NULL AND `Unnamed: 9` IS NULL AND
        `Unnamed: 10` IS NOT NULL
       """)

    inns = cursor.fetchall()

    token = "0cd747cee6b670b9ae47fcceb44b5bd41ff8340b"
    dadata = Dadata(token)

    for i in inns:
        result = dadata.find_by_id(name="party", query=i['inn'])
        if result[0]['data']['address']['data']['area'] != None:
            cursor.execute(
                f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = '{result[0]['data']['address']['data']['area']}'
                     WHERE `Unnamed: 5` = '{i['inn']}'""")
            g.db.commit()



    cursor.execute(
        f"""SELECT DISTINCT (`Unnamed: 8`) as rayon FROM 10_05_2022_all
        WHERE `Unnamed: 8` NOT IN ('Район') AND `Unnamed: 8` IS NOT NULL
       """)
    rayons = cursor.fetchall()

    cursor.execute(
        f"""SELECT DISTINCT (`Unnamed: 9`) as citys FROM 10_05_2022_all
                WHERE `Unnamed: 9` NOT IN ('Город') AND `Unnamed: 9` IS NOT NULL
               """)

    city = cursor.fetchall()

    # потом при выводе пользователю таблицы соответствий надо сделать будет аппером районы и города, потом сравнивать с
    # заранее подготовленными 7 городами и другими районами Кр края на основные вхождения, если где-то отличие, то показывать пользователю

    for i in rayons:
        cursor = get_db().cursor()
        cursor.execute(
            f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = '{i['rayon'].split()[0].upper()}'
            WHERE `Unnamed: 8` REGEXP '\\\\b{i['rayon']}\\\\b'""")
        g.db.commit()

    for i in city:
        cursor = get_db().cursor()
        cursor.execute(
            f"""UPDATE 10_05_2022_all SET `Unnamed: 9` = '{i['citys'].split()[-1].upper()}'
            WHERE `Unnamed: 9` REGEXP '\\\\b{i['citys']}\\\\b'""")
        g.db.commit()



    cursor.execute(
        f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = `Unnamed: 9`
        WHERE `Unnamed: 8` IS NULL""")
    g.db.commit()



    arr_what_change = {

        'КРОПОТКИН': 'КАВКАЗСКИЙ',
        'КРЫМСК': 'КРЫМСКИЙ',
        'КУРГАНИНСК': 'КУРГАНИНСКИЙ',
        'ЛАБИНСК': 'ЛАБИНСКИЙ',
        'НОВОКУБАНСК': 'НОВОКУБАНСКИЙ',
        'ПРИМОРСКО-АХТАРСК': 'ПРИМОРСКО-АХТАРСКИЙ',
        'СЛАВЯНСК-НА-КУБАНИ': 'СЛАВЯНСКИЙ',
        'ТЕМРЮК': 'ПГТ.СИРИУС',
        'ТИМАШЕВСК': 'ТИМАШЕВСКИЙ',
        'ТИХОРЕЦК': 'ТИХОРЕЦКИЙ',
        'ТУАПСЕ': 'ТУАПСИНСКИЙ',
        'УСТЬ-ЛАБИНСК': 'УСТЬ-ЛАБИНСКИЙ',

        'АНАПСКИЙ': 'АНАПА',
        'АРМАВИРСКИЙ': 'АРМАВИР',
        'ГЕЛЕНДЖИКСКИЙ': 'ГЕЛЕНДЖИК',
        'КЛЮЧ': 'ГОРЯЧИЙ КЛЮЧ',
        'КРАСНОДАРСКИЙ КРАЙ': 'КРАСНОДАР',
        'НОВОРОССИЙСКИЙ': 'НОВОРОССИЙСК',
        'СИРИУС': 'ПГТ.СИРИУС',
        'СОЧИНСКИЙ': 'СОЧИ'

    }



    for i in arr_what_change:
        cursor.execute(
            f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = '{arr_what_change[i]}'
            WHERE `Unnamed: 8` = '{i}'""")
        g.db.commit()

    cursor.execute(
        f"""DELETE FROM 10_05_2022_all
        WHERE `Unnamed: 0` IS NULL""")
    g.db.commit()

    cursor.execute(
        f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = 'НЕИЗВЕСТНЫЕ'
            WHERE `Unnamed: 8` IS NULL""")
    g.db.commit()




    cursor.execute(
        f"""SELECT DISTINCT (`Unnamed: 8`) as rayon FROM 10_05_2022_all
        WHERE `Unnamed: 8` NOT IN ('Район', 'АНАПА', 'АРМАВИР', 'ГОРЯЧИЙ КЛЮЧ', 'КРАСНОДАР', 'НОВОРОССИЙСК', 'СОЧИ',
        'ГЕЛЕНДЖИК', 'ПГТ.СИРИУС')
       """)
    rayons = cursor.fetchall()

    allRayons = {'ЕЙСК': 'ЕЙСКИЙ', 'ГУЛЬКЕВИЧИ': 'ГУЛЬКЕВИЧСКИЙ', 'БЕЛОРЕЧЕНСК': 'БЕЛОРЕЧЕНСКИЙ',
                 'АБИНСК': 'АБИНСКИЙ', 'АПШЕРОНСК': 'АПШЕРОНСКИЙ', 'КОРЕНОВСК': 'КОРЕНОВСКИЙ'}

    for i in rayons:
        if i['rayon'][-3:] != 'КИЙ' and i['rayon'][-3:] != 'КОЙ' and i['rayon'] != 'НЕИЗВЕСТНЫЕ':
            for e in allRayons:
                if e == i['rayon']:
                    cursor.execute(
                        f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = '{allRayons[e]}'
                        WHERE `Unnamed: 8` = '{e}'""")
                    g.db.commit()

    cursor.execute(
        f"""UPDATE 10_05_2022_all SET `Unnamed: 8` = 'НЕИЗВЕСТНЫЕ'
               WHERE `Unnamed: 8` IS NULL""")
    g.db.commit()



    cursor.execute(
        f"""UPDATE 10_05_2022_all SET `Unnamed: 9` = 'ГОРЯЧИЙ КЛЮЧ'
             WHERE `Unnamed: 9` = 'КЛЮЧ'""")
    g.db.commit()


    return jsonify()


@app.route('/make_tables', methods=['GET'])
def make_tables():

    path = 'rsmp_stat_federal_district_14.06.2022.xlsx'  # потом поменять переменные
    data = '10.05.2022'
    #
    stat = openpyxl.load_workbook(path) # загружается эксель со статистикой

    region_middle_value = {'Дата': data, 'Район': 'Краснодарский край',
                           'Всего': stat['Лист1'][9][1].value,
                           'ЮЛ': stat['Лист1'][9][2].value, 'ИП': stat['Лист1'][9][3].value}


    # вставляет в сред численные
    cursor = get_db().cursor()


    cursor.execute(
        f"""INSERT INTO sred_chisl(data, rayon, vsego, ur, ip)
        VALUES('{region_middle_value['Дата']}', '{region_middle_value['Район']}',
        '{region_middle_value['Всего']}', '{region_middle_value['ЮЛ']}', '{region_middle_value['ИП']}')""")
    g.db.commit()


    # вставляет в импорт дата
    cursor.execute(
        f"""SELECT MAX(id) as id FROM sred_chisl
               """)
    id = cursor.fetchall()


    # вставляет названия таблиц в инфо блок
    cursor.execute(
    f"""INSERT INTO import_data(data, svodn, vnov_sozd, sred_chisl)
    VALUES('{datetime.date(datetime.strptime(data, '%d.%m.%Y'))}',
    '{'_'.join(data.split('.'))}_svodnye',
    '{'_'.join(data.split('.'))}_vnov_sozd',
    '{id[0]['id']}')""")
    g.db.commit()



    # делает сортировочные таблицы
    cursor.execute(
        f"""CREATE TABLE {'_'.join(data.split('.'))}_svodnye
    (
    Id serial,
    rayon varchar(200),
    micro_ur INT,
    malye_ur INT,
    srednie_ur INT,
    vsego_ur INT,
    micro_ip INT,
    malye_ip INT,
    srednie_ip INT,
    vsego_ip INT
    )""")
    g.db.commit()

    cursor.execute(
        f"""CREATE TABLE {'_'.join(data.split('.'))}_vnov_sozd
        (
        Id serial,
        rayon varchar(200),
        micro_ur INT,
        malye_ur INT,
        srednie_ur INT,
        vsego_ur INT,
        micro_ip INT,
        malye_ip INT,
        srednie_ip INT,
        vsego_ip INT
        )""")
    g.db.commit()
    # тут


    cursor.execute(
            f"""SELECT `Unnamed: 8` as rayon, `Unnamed: 3` as kategorya, COUNT(`Unnamed: 3`) as vsego FROM 10_05_2022_all
            WHERE `Unnamed: 3` IN ('Микропредприятие', 'Малое предприятие', 'Среднее предприятие')
            AND `Unnamed: 2` = 'Юридическое лицо'
            GROUP BY `Unnamed: 8`, `Unnamed: 3`
            """)

    ur = cursor.fetchall()



    arr = []
    for i in ur:
        if i['rayon'] not in arr:
            arr.append(i['rayon'])

    ur_res = {}
    for i in arr:
        micro = []
        maloe = []
        srednee = []
        for e in ur:
            if i == e['rayon'] and e['kategorya'] == 'Микропредприятие':
                micro.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Малое предприятие':
                maloe.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Среднее предприятие':
                srednee.append(e['vsego'])
        ur_res.setdefault(i, {'Микропредприятие': sum(micro), 'Малое предприятие': sum(maloe),
                              'Среднее предприятие': sum(srednee), 'всего': sum(micro) + sum(maloe) + sum(srednee)})




    cursor.execute(
        f"""SELECT `Unnamed: 8` as rayon, `Unnamed: 3` as kategorya, COUNT(`Unnamed: 3`) as vsego FROM 10_05_2022_all
                  WHERE `Unnamed: 3` IN ('Микропредприятие', 'Малое предприятие', 'Среднее предприятие')
                  AND `Unnamed: 2` = 'Индивидуальный предприниматель'
                  GROUP BY `Unnamed: 8`, `Unnamed: 3`
                  """)

    ip = cursor.fetchall()

    arr = []
    for i in ip:
        if i['rayon'] not in arr:
            arr.append(i['rayon'])

    ip_res = {}
    for i in arr:
        micro = []
        maloe = []
        srednee = []
        for e in ip:
            if i == e['rayon'] and e['kategorya'] == 'Микропредприятие':
                micro.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Малое предприятие':
                maloe.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Среднее предприятие':
                srednee.append(e['vsego'])
        ip_res.setdefault(i, {'Микропредприятие': sum(micro), 'Малое предприятие': sum(maloe),
                              'Среднее предприятие': sum(srednee), 'всего': sum(micro) + sum(maloe) + sum(srednee)})



    rayons = []
    for i in ur_res:
        rayons.append(i)
    for i in ip_res:
        rayons.append(i)

    rayons = list(set(rayons))




    for i in rayons:
        cursor.execute(
            f"""INSERT INTO {'_'.join(data.split('.'))}_svodnye (rayon)
            VALUES('{i}')""")
        g.db.commit()




        for e in ur_res:
            if i == e:
                cursor.execute(
                    f"""UPDATE {'_'.join(data.split('.'))}_svodnye SET micro_ur = '{int(ur_res[i]['Микропредприятие'])}',
                    malye_ur = '{int(ur_res[i]['Малое предприятие'])}',
                    srednie_ur = '{int(ur_res[i]['Среднее предприятие'])}',
                    vsego_ur = '{int(ur_res[i]['всего'])}'
                    WHERE rayon = '{i}'""")
                g.db.commit()

        for e in ip_res:
            if i == e:
                cursor.execute(
                    f"""UPDATE {'_'.join(data.split('.'))}_svodnye SET micro_ip = '{int(ip_res[i]['Микропредприятие'])}',
                                  malye_ip = '{int(ip_res[i]['Малое предприятие'])}',
                                  srednie_ip = '{int(ip_res[i]['Среднее предприятие'])}',
                                  vsego_ip = '{int(ip_res[i]['всего'])}'
                                  WHERE rayon = '{i}'""")
                g.db.commit()




    cursor.execute(
        f"""SELECT `Unnamed: 8` as rayon, `Unnamed: 3` as kategorya, COUNT(`Unnamed: 3`) as vsego FROM 10_05_2022_all
              WHERE `Unnamed: 3` IN ('Микропредприятие', 'Малое предприятие', 'Среднее предприятие')
              AND `Unnamed: 2` = 'Юридическое лицо' and `Unnamed: 11` = 'Да'
              GROUP BY `Unnamed: 8`, `Unnamed: 3`
              """)

    ur = cursor.fetchall()
    arr = []
    for i in ur:
        if i['rayon'] not in arr:
            arr.append(i['rayon'])

    ur_res = {}
    for i in arr:
        micro = []
        maloe = []
        srednee = []
        for e in ur:
            if i == e['rayon'] and e['kategorya'] == 'Микропредприятие':
                micro.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Малое предприятие':
                maloe.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Среднее предприятие':
                srednee.append(e['vsego'])
        ur_res.setdefault(i, {'Микропредприятие': sum(micro), 'Малое предприятие': sum(maloe),
                              'Среднее предприятие': sum(srednee), 'всего': sum(micro) + sum(maloe) + sum(srednee)})

    cursor.execute(
        f"""SELECT `Unnamed: 8` as rayon, `Unnamed: 3` as kategorya, COUNT(`Unnamed: 3`) as vsego FROM 10_05_2022_all
                    WHERE `Unnamed: 3` IN ('Микропредприятие', 'Малое предприятие', 'Среднее предприятие')
                    AND `Unnamed: 2` = 'Индивидуальный предприниматель' and `Unnamed: 11` = 'Да'
                    GROUP BY `Unnamed: 8`, `Unnamed: 3`
                    """)

    ip = cursor.fetchall()


    arr = []
    for i in ip:
        if i['rayon'] not in arr:
            arr.append(i['rayon'])

    ip_res = {}
    for i in arr:
        micro = []
        maloe = []
        srednee = []
        for e in ip:
            if i == e['rayon'] and e['kategorya'] == 'Микропредприятие':
                micro.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Малое предприятие':
                maloe.append(e['vsego'])
            elif i == e['rayon'] and e['kategorya'] == 'Среднее предприятие':
                srednee.append(e['vsego'])
        ip_res.setdefault(i, {'Микропредприятие': sum(micro), 'Малое предприятие': sum(maloe),
                              'Среднее предприятие': sum(srednee), 'всего': sum(micro) + sum(maloe) + sum(srednee)})

    rayons = []
    for i in ur_res:
        rayons.append(i)
    for i in ip_res:
        rayons.append(i)
    rayons = list(set(rayons))

    for i in rayons:
        cursor.execute(
            f"""INSERT INTO {'_'.join(data.split('.'))}_vnov_sozd(rayon)
              VALUES('{i}')""")
        g.db.commit()

        for e in ur_res:
            if i == e:
                cursor.execute(
                    f"""UPDATE {'_'.join(data.split('.'))}_vnov_sozd SET
                    micro_ur = '{int(ur_res[i]['Микропредприятие'])}',
                      malye_ur = '{int(ur_res[i]['Малое предприятие'])}',
                      srednie_ur = '{int(ur_res[i]['Среднее предприятие'])}',
                      vsego_ur = '{int(ur_res[i]['всего'])}'
                      WHERE rayon = '{i}'""")
                g.db.commit()

        for e in ip_res:
            if i == e:
                cursor.execute(
                    f"""UPDATE {'_'.join(data.split('.'))}_vnov_sozd
                    SET micro_ip = '{int(ip_res[i]['Микропредприятие'])}',
                                    malye_ip = '{int(ip_res[i]['Малое предприятие'])}',
                                    srednie_ip = '{int(ip_res[i]['Среднее предприятие'])}',
                                    vsego_ip = '{int(ip_res[i]['всего'])}'
                                    WHERE rayon = '{i}'""")
                g.db.commit()

    return jsonify()


@app.route('/sred_stat', methods=['POST'])
def sred_stat():
    request_data = request.get_json()
    user_request = {

        'date': request_data['date']
    }
    arr = []
    for i in user_request['date']:
        cursor = get_db().cursor()
        cursor.execute(
            f"""SELECT data, rayon, vsego, ur, ip FROM sred_chisl
                     WHERE data = '{i}'
                     """)

        all = cursor.fetchall()
        arr.append(all[0])

    ind = 0

    total = []
    while ind < len(arr):
        sl = {}
        if arr[ind] > arr[ind + 1]:
            sl.update({})


        ind += 1






    return jsonify()



@app.route('/getDatas', methods=['POST'])
def getDatas():
    request_data = request.get_json()
    user_request = {

        'data': request_data['data'],
        'button': request_data['button']
    }

    user_request['data'] = user_request['data'].replace('.', '_')

    if user_request['button'] == 'Вновь созданные':
        user_request['button'] = 'vnov_sozd'
    elif user_request['button'] == 'Сводные данные':
        user_request['button'] = 'svodnye'

    toBd = f'''{user_request['data']}_{user_request['button']}'''
    cursor = get_db().cursor()

    cursor.execute(
        f"""SELECT * FROM {toBd}
       """)
    rayons = cursor.fetchall()

    res = []
    first = ['АНАПА','АРМАВИР','ГЕЛЕНДЖИК','ГОРЯЧИЙ КЛЮЧ','КРАСНОДАР','НОВОРОССИЙСК','ПГТ.СИРИУС','СОЧИ', 'НЕИЗВЕСТНЫЕ']




    citys = []
    rayon = []
    unknown = []

    for i in rayons:
        for e in first:
            if i['rayon'] == e and i['rayon'] != 'НЕИЗВЕСТНЫЕ':
                citys.append(i)


    for i in rayons:
        if i['rayon'] not in first:
            rayon.append(i)

    for i in rayons:
        if i['rayon'] == 'НЕИЗВЕСТНЫЕ':
            unknown.append(i)

    for i in sorted(citys, key=lambda x: x['rayon']):
        res.append(i)

    for i in sorted(rayon, key=lambda x: x['rayon']):
        res.append(i)

    res.append(unknown[0])


    return jsonify(res)



@app.route('/getDate', methods=['GET'])
def getDate():
    cursor = get_db().cursor()
    cursor.execute(
        f"""SELECT data FROM sred_chisl
       """)
    dates = cursor.fetchall()


    return jsonify(dates)



@app.route('/getsredChisl', methods=['GET'])
def getsredChisl():
    cursor = get_db().cursor()
    cursor.execute(
        f"""SELECT * FROM sred_chisl
       """)
    all = cursor.fetchall()

    return jsonify(all)




@app.route('/innSearch', methods=['POST'])
def innSearch():
    request_data = request.get_json()
    user_request = {
        'inn': request_data['inn'],
        'date': request_data['date']
    }

    user_request['date'] = f'''{'_'.join(user_request['date'].split('.'))}_all'''
    arrUr = {'Микропредприятия': [], 'Малые предприятия': [], 'Средние предприятия': []}
    arrIp = {'Микропредприятия': [], 'Малые предприятия': [], 'Средние предприятия': []}

    cursor = get_db().cursor()
    cursor.execute(
        f"""SELECT `Unnamed: 2`, `Unnamed: 3`, `Unnamed: 5`, `Unnamed: 1`, `Unnamed: 8`,
        `Unnamed: 9`, `Unnamed: 10`
        FROM {user_request['date']}
        WHERE `Unnamed: 3` <> 'Не является субъектом МСП' AND `Unnamed: 5` REGEXP '^{user_request['inn']}' """)


    dates = cursor.fetchall()
    for i in dates:

        if i['Unnamed: 2'] == 'Юридическое лицо':
            if i['Unnamed: 3'] == 'Микропредприятие':
                arrUr['Микропредприятия'].append(i)
            elif i['Unnamed: 3'] == 'Малое предприятие':
                arrUr['Малые предприятия'].append(i)
            else:
                arrUr['Средние предприятия'].append(i)
        else:
            if i['Unnamed: 3'] == 'Микропредприятие':
                arrIp['Микропредприятия'].append(i)
            elif i['Unnamed: 3'] == 'Малое предприятие':
                arrIp['Малые предприятия'].append(i)
            else:
                arrIp['Средние предприятия'].append(i)

    if len(arrUr['Микропредприятия']) == 0:
        del arrUr['Микропредприятия']
    if len(arrUr['Малые предприятия']) == 0:
        del arrUr['Малые предприятия']

    if len(arrUr['Средние предприятия']) == 0:
        del arrUr['Средние предприятия']


    if len(arrIp['Микропредприятия']) == 0:
        del arrIp['Микропредприятия']
    if len(arrIp['Малые предприятия']) == 0:
        del arrIp['Малые предприятия']

    if len(arrIp['Средние предприятия']) == 0:
        del arrIp['Средние предприятия']



    return jsonify(arrUr, arrIp)



@app.route('/mainSearch', methods=['POST'])
def mainSearch():
    request_data = request.get_json()
    user_request = {
        'stringParamsObject': request_data['stringParamsObject']

    }

    user_request['stringParamsObject']['date'][0] = f'''{'_'.join(user_request['stringParamsObject']['date'][0].split('.'))}_all'''

    arrUr = {'Микропредприятия': [], 'Малые предприятия': [], 'Средние предприятия': []}
    arrIp = {'Микропредприятия': [], 'Малые предприятия': [], 'Средние предприятия': []}

    cursor = get_db().cursor()
    cursor.execute(
        f"""SELECT `Unnamed: 2`, `Unnamed: 3`, `Unnamed: 5`, `Unnamed: 1`, `Unnamed: 8`,
        `Unnamed: 9`, `Unnamed: 10`
        FROM 10_05_2022_all
        WHERE `Unnamed: 3` <> 'Не является субъектом МСП' AND `Unnamed: 5` = '2312065303'""")

    dates = cursor.fetchall()
    for i in dates:

        if i['Unnamed: 2'] == 'Юридическое лицо':
            if i['Unnamed: 3'] == 'Микропредприятие':
                arrUr['Микропредприятия'].append(i)
            elif i['Unnamed: 3'] == 'Малое предприятие':
                arrUr['Малые предприятия'].append(i)
            else:
                arrUr['Средние предприятия'].append(i)
        else:
            if i['Unnamed: 3'] == 'Микропредприятие':
                arrIp['Микропредприятия'].append(i)
            elif i['Unnamed: 3'] == 'Малое предприятие':
                arrIp['Малые предприятия'].append(i)
            else:
                arrIp['Средние предприятия'].append(i)

    if len(arrUr['Микропредприятия']) == 0:
        del arrUr['Микропредприятия']
    if len(arrUr['Малые предприятия']) == 0:
        del arrUr['Малые предприятия']

    if len(arrUr['Средние предприятия']) == 0:
        del arrUr['Средние предприятия']

    if len(arrIp['Микропредприятия']) == 0:
        del arrIp['Микропредприятия']
    if len(arrIp['Малые предприятия']) == 0:
        del arrIp['Малые предприятия']

    if len(arrIp['Средние предприятия']) == 0:
        del arrIp['Средние предприятия']

    return jsonify(arrUr, arrIp)

    # cursor = get_db().cursor()
    # cursor.execute(
    #     f"""SELECT `Unnamed: 2`, `Unnamed: 3`, `Unnamed: 5`, `Unnamed: 1`, `Unnamed: 8`,
    #      `Unnamed: 9`, `Unnamed: 10`
    #      FROM {user_request['stringParamsObject']}
    #      WHERE `Unnamed: 3` <> 'Не является субъектом МСП' AND `Unnamed: 5` REGEXP '^{user_request['inn']}' """)
    #
    # dates = cursor.fetchall()


if __name__ == '__main__':
    app.run(port=5020)
