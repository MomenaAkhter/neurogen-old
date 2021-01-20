// randomly mutate the weights and biases of a NN based on the amount

function mutate(nn: NeuralNetworkModel, amount: number): NeuralNetworkModel {
	// weights

	var new_weights = [];

	// i -> matrix representing weights between 2 layers

	for (var i in range(len(nn.weights))) {
		new_weights.push([]);

		let size_y = len(nn.weights[i]);
		let size_x = len(nn.weights[i][0]);

		for (var j in range(size_y)) {
			new_weights[i].push([]);

			for (var k in range(size_x)) {
				new_weights[i][j].push([]);

				let random_variation = nn.weights[i][j][k] * amount * Math.round(random(-1, 1));

				new_weights[i][j][k] = nn.weights[i][j][k] + random_variation;
			}
		}
	}

	var new_biases = [];

	for (var i in range(len(nn.biases))) {
		new_biases.push([[]]);

		let size = len(nn.biases[i][0]);

		for (var j in range(size)) {
			let random_variation = nn.biases[i][0][j] * amount;
			let r = random(-random_variation, random_variation);

			new_biases[i][0].push(nn.biases[i][0][j] + r);
		}
	}

	let new_nn = clone_nnm(nn);

	new_nn.weights = new_weights;
	new_nn.biases = new_biases;

	return new_nn;
}

// spawn the first generation randomly
function initialize_evolution(model: SimulationModel): SimulationModel {
	let new_model: SimulationModel = clone_sm(model);

	let first_gen: Generation = {
		cars: [],
		time: Date.now()
	};

	new_model.generations.push(first_gen);

	// populate the generation
	for (let i in range(model.population_size)) {
		first_gen.cars.push(create_car(model));
	}

	furthest_car = first_gen.cars[0];

	return new_model;
}

function fitness(distance: number, avg_speed: number): number {
	return distance * avg_speed;
}

function last_generation(model: SimulationModel): Generation {
	return model.generations[len(model.generations) - 1];
}

function breed_generation(model: SimulationModel): SimulationModel {
	// Select 10% of the best members for reproduction
	const selection_count: number = model.population_size * .1;

	// const selection_count: number = Math.ceil(0.1 * model.population_size);
	const mutation_rate: number = 0.01;

	// natural selection

	let fittest_individuals: Car[] =
		best_fit_select(model, selection_count);

	// entry for new generation

	let new_gen: Generation = {
		cars: [],
		time: Date.now()
	};

	// insert the new generation in the list of generations

	model.generations.push(new_gen);

	// fill the new generation with crossovers

	while (len(new_gen.cars) != model.population_size) {
		new_gen.cars.push(
			crossover(model, fittest_individuals));
	}

	// mutate the newly formed generation

	new_gen.cars.forEach(function (car: Car) {
		car.nn = mutate(car.nn, mutation_rate);
	});

	return model;
}

function get_car(model: SimulationModel, index: number[]): Car {
	return model.generations
	[index[0]]
	[index[1]];
}

// takes random genes from the best fit individuals and generates a child

function crossover(model: SimulationModel, individuals: Car[]): Car {
	let new_car: Car = create_car(model);

	let x: number = 0;

	let individuals_count: number = len(individuals);

	// weights

	new_car.nn.weights.forEach(function (weight_layer) {
		let y: number = 0;

		weight_layer.forEach(function (weight_row) {
			let z: number = 0;

			weight_row.forEach(function (weight_col) {
				new_car.nn.weights[x][y][z] =
					individuals[rand_int(0, individuals_count - 1)].nn.weights[x][y][z];

				z++;
			});

			y++;
		});

		x++;
	});

	// biases

	x = 0;

	new_car.nn.biases.forEach(function (weight_layer) {
		let y: number = 0;

		weight_layer.forEach(function (weight_row) {
			let z: number = 0;

			weight_row.forEach(function (weight_col) {
				new_car.nn.biases[x][y][z] =
					individuals[rand_int(0, individuals_count - 1)].nn.biases[x][y][z];

				z++;
			});

			y++;
		});

		x++;
	});

	return new_car;
}

function best_fit_select(model: SimulationModel, quantity: number): Car[] {
	let individuals: Generation = last_generation(model);

	individuals.cars.sort(function (a, b) {
		return b.fitness - a.fitness;
	});

	let output: String = "Generation " + (model.current_generation_index + 1) + ": " + len(model.generations);
	let average: number = 0;
	individuals.cars.forEach(function (car: Car) {
		output += car.fitness + " ";
		average += car.fitness;
	});
	average /= model.population_size;
	console.log(output + "\nAverage: " + average);

	let selected_individuals: Car[] = individuals.cars.splice(0, quantity);

	return selected_individuals;
}