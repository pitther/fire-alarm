from numpy.random import randint
from numpy.random import rand
import numpy as np

class Genetic_Algorithm:
    def __init__(self, matrix, radius, count, bits_number = 10, iterarions_number = 1000, pop_number = 100, crossover_ratio = 0.7, tournament_memb = 4, eps = 0.01, sensor_chance = 1.0):
        borders = []
        for i in range(count):
            borders.append([0, (len(matrix[0]) - 1)])
            borders.append([0, (len(matrix) - 1)])
        #print(borders)
        self.borders = borders
        self.matrix = matrix
        self.radius = radius
        self.count = count
        self.bits_number = bits_number
        self.iterations_number = iterarions_number
        self.pop_number = pop_number
        self.crossover_ratio = crossover_ratio
        self.mutation_ratio = 1.0 / (float(bits_number) * len(borders))
        self.tournament_memb = tournament_memb
        self.eps = eps
        self.pop_best = list()
        self.sensor_chance = sensor_chance

    def calculate_coefficient(self, matrix, coordinates, radius, chance=1.0):
        k = 0  # efficiency of the current sensors positioning
        matrix_length_col = len(matrix[0])
        matrix_length_row = len(matrix)

        # chance the sensor will actuate for the given cell
        chance_matrix = [[0.0] * matrix_length_col for _ in
                         range(matrix_length_row)]  # initialize and fill 2d array with 0

        for coordinates_xy in coordinates:
            sensor_row = coordinates_xy[0]  # sensor coordinates
            sensor_col = coordinates_xy[1]

            border_row = sensor_row + radius  # sensor radius borders
            border_col = sensor_col + radius

            cell_row = sensor_row - radius
            while cell_row <= border_row:  # checking every cell in sensor radius
                if 0 <= cell_row < matrix_length_col:
                    cell_col = sensor_col - radius

                    while cell_col <= border_col:
                        if 0 <= cell_col < matrix_length_row:
                            if chance_matrix[cell_col][cell_row] < 1:  # if the chance of actuation isn't 1 already
                                current_cell = matrix[cell_col][cell_row]

                                # the calculation formula (subject to change)
                                cell_coefficient = (current_cell[0] + current_cell[1]) / 2

                                # delete old value, calculate with new chance coefficient
                                k = k - chance_matrix[cell_col][cell_row] * cell_coefficient
                                chance_matrix[cell_col][cell_row] += chance

                                if chance_matrix[cell_col][cell_row] > 1:
                                    chance_matrix[cell_col][cell_row] = 1

                                k = k + chance_matrix[cell_col][cell_row] * cell_coefficient
                        cell_col += 1
                cell_row += 1
        chance_matrix.append(k)
        return chance_matrix

    def function(self, x):
        list = []
        testMatrix = self.matrix
        testRadius = self.radius
        for i in range(0, len(x), 2):
            list.append([int(x[i]), int(x[i + 1])])
        res = self.calculate_coefficient(testMatrix, list, testRadius, self.sensor_chance)
        k = res[-1]
        res.pop()
        return k

    def functionMatr(self, x):
        list = x
        testMatrix = self.matrix
        testRadius = self.radius
        res = self.calculate_coefficient(testMatrix, list, testRadius, self.sensor_chance)
        res.pop()
        return res

    def decode(self, bitstring):
        decoded = list()
        max = 2**self.bits_number
        for i in range(len(self.borders)):
            start, end = i * self.bits_number, (i*self.bits_number)+self.bits_number
            substring = bitstring[start:end]
            numb = ''.join([str(s) for s in substring])
            intNumb = int(numb, 2)
            val = int(self.borders[i][0]+(intNumb/max)*(self.borders[i][1]-self.borders[i][0]))
            decoded.append(val)
        return decoded

    def tournament(self, population, fitnes):
        indx = randint(len(population))
        for i in randint(0, len(population), self.tournament_memb):
            if fitnes[i] > fitnes[indx]:
                indx = i
        return population[indx]

    def crossover(self, par1, par2):
        child1, child2 = par1.copy(), par2.copy()
        if rand() < self.crossover_ratio:
            crossover_point = randint(1, len(par1)-2)
            child1 = par1[:crossover_point] + par2[crossover_point:]
            child2 = par2[:crossover_point] + par1[crossover_point:]
        return [child1, child2]

    def mutation(self, bitstring):
        for i in range(len(bitstring)):
            if rand() < self.mutation_ratio:
                bitstring[i] = 1 - bitstring[i]

 ################################################## send data to something
    def best_Sol_Send(self, best, best_sol, iter):
        decodedAns = self.decode(best)
        ans = []
        for i in range(0, len(decodedAns), 2):
            ans.append([int(decodedAns[i]), int(decodedAns[i + 1])])
        matr = self.functionMatr(ans)
        #print(ans)                          #solution
        #print(matr)                         #matrix of chances
        #
        # print("Generation ", iter)          #iteration
########################################################################################

    def realization(self):
        population = [randint(0,2, self.bits_number*len(self.borders)).tolist() for _ in range(self.pop_number)]
        best, best_fitnes, av_fitnes = 0, self.function(self.decode(population[0])), sum([self.function(self.decode((p))) for p in population])/len(population)
        best_fitnes_prev1 = self.bits_number
        generation = 0
        flag = True
        while flag:

            best_fitnes_prev = self.bits_number
            av_fitnes_prev = av_fitnes
            decoded = [self.decode(p) for p in population]
            fitnes = [self.function(d) for d in decoded]
            for i in range(self.pop_number):
                if fitnes[i] > best_fitnes:
                    best, best_fitnes = population[i], fitnes[i]
                    self.best_Sol_Send(best, best_fitnes, generation)

            selected = [self.tournament(population, fitnes) for _ in range(self.pop_number)]
            childrens = list()
            for i in range(0, self.pop_number, 2):
                par1, par2 = selected[i], selected[i+1]
                for child in self.crossover(par1, par2):
                    self.mutation(child)
                    childrens.append(child)
            population = childrens
            av_fitnes = sum([self.function(self.decode((p))) for p in population])/len(population)
            generation += 1
            for i in range(self.pop_number):
                if fitnes[i] > best_fitnes_prev:
                    best_fitnes_prev = fitnes[i]
            self.pop_best.append(best_fitnes_prev)
            #if (abs(best_fitnes_prev - best_fitnes_prev1)> self.eps) and generation < self.iterations_number or generation < 15:
            if (abs(av_fitnes-av_fitnes_prev)>self.eps) and generation < self.iterations_number or generation<15:
                flag = True
            else:
                flag = False
            best_fitnes_prev1=best_fitnes_prev
        decodedAns = self.decode(best)
        ans = []
        for i in range(0, len(decodedAns), 2):
            ans.append([int(decodedAns[i]), int(decodedAns[i + 1])])
        return [generation, ans, best_fitnes]

def toFixed(numObj, digits=0):
    return f"{numObj:.{digits}f}"

#TestMatrix
testMatrix = [[[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.9, 0.4], [0.3, 0.5], [0.6, 0.6], [0.8, 0.2], [0.6, 0.5],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.9, 0.4], [0.3, 0.5], [0.6, 0.6], [0.8, 0.2], [0.6, 0.5],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.6, 0.2], [0.1, 0.3], [0.9, 0.8], [0.5, 0.1], [0.8, 0.3],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.9, 0.4], [0.3, 0.5], [0.6, 0.6], [0.8, 0.2], [0.6, 0.5],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.9, 0.4], [0.3, 0.5], [0.6, 0.6], [0.8, 0.2], [0.6, 0.5],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],[[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.9, 0.4], [0.3, 0.5], [0.6, 0.6], [0.8, 0.2], [0.6, 0.5],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.7, 0.5], [0.4, 0.4], [0.1, 0.4], [0.6, 0.7], [0.5, 0.7],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]],
              [[0.6, 0.2], [0.1, 0.3], [0.9, 0.8], [0.5, 0.1], [0.8, 0.3],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8], [0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1],[0.5, 0.1], [0.4, 0.7], [0.3, 0.5], [0.2, 0.5], [0.1, 0.8],[0.3, 0.2], [0.7, 0.8], [0.2, 0.3], [0.3, 0.2], [0.2, 0.1]]]
#radius and sensor quantity
radius = 3
count = 10
#algorithm calling
#1 - matrix, 2 - sensor radius, 3 - quantity of sensors, 4-sensor alarm chance
#ga = Genetic_Algorithm(testMatrix, radius, count, sensor_chance=1.0)
#gen, best, best_sol = ga.realization()
#print("Solution: ", best, " Best answer:", toFixed(best_sol,5), " Iteration:", gen)