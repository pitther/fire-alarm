from flask import Flask, request, jsonify
from flask_cors import CORS
from genAlg import *


app = Flask(__name__)

CORS(app)


@app.route('/sendData', methods=['POST'])
def hello_world():
    content = request.json
    importances = np.array(content['importances'])
    fire_expectancies = np.array(content['fireExpectancies'])
    alarms = content['alarms']
    radius = alarms['radius']
    count = alarms['count']
    chance = alarms['chance']
    matrix = []
    print(np.array(fire_expectancies).shape)
    for fire_expect, imp,  in zip(fire_expectancies,importances):
        row = []
        for i,j in zip(fire_expect,imp):
            row.append([i,j])
        matrix.append(row)
        
    
    ga = Genetic_Algorithm(matrix, radius, count, sensor_chance=chance)
    gen, best, best_sol = ga.realization()
    print("Solution: ", best, " Best answer:", toFixed(best_sol,5), " Iteration:", gen)

    result = []
    for i in best:
        result.append({"x": i[0], "y": i[1], "r": radius})

    return { "error": 0, "alarms": result }
 
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
    

