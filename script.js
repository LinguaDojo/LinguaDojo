// === CONFIGURACIÓN Y ESTADO ===
const state = {
    view: 'intro',
    gems: localStorage.getItem('lingua_gems') ? parseInt(localStorage.getItem('lingua_gems')) : 0,
    streak: localStorage.getItem('lingua_streak') ? parseInt(localStorage.getItem('lingua_streak')) : 0,
    lives: 5,
    isPro: localStorage.getItem('lingua_pro') === 'true',
    currentUnit: 1,
    currentLevel: null,
    progress: 0,
    completedLevels: JSON.parse(localStorage.getItem('lingua_completed')) || [],
};

// === BASE DE DATOS DE LECCIONES (INGLÉS A1) ===
const courseData = {
    units: [
        {
            id: 1, title: "Primeros Pasos", icon: "🛸",
            levels: [
                ["Hola", "Hello", "____!", ["Hello", "Goodbye", "Morning", "Water"], "👋", "Para saludar usa <b>Hello</b>.", "Hello!"],
                ["Yo soy", "I am", "____ John", ["I am", "You are", "He is", "They are"], "👤", "Presentarse con <b>I am</b>.", "I am Alex"],
                ["Uno", "One", "Number ____", ["One", "Two", "Three", "Four"], "1️⃣", "El número uno.", "One apple"],
                ["Adiós", "Goodbye", "____!", ["Goodbye", "Hello", "Please", "Thanks"], "🏃", "Despedirse con <b>Goodbye</b>.", "Goodbye!"],
                ["Dos", "Two", "Number ____", ["Two", "One", "Three", "Four"], "2️⃣", "El número dos.", "Two cars"],
                ["Por favor", "Please", "____, help me", ["Please", "Thanks", "Sorry", "Yes"], "🙏", "Pedir cosas con <b>Please</b>.", "Coffee, please"],
                ["Gracias", "Thanks", "____ for everything", ["Thanks", "Hi", "No", "Please"], "✨", "Agradecer con <b>Thanks</b>.", "Thanks, friend"],
                ["Tres", "Three", "Number ____", ["Three", "Two", "One", "Four"], "3️⃣", "El número tres.", "Three dogs"],
                ["Sí", "Yes", "____, I am", ["Yes", "No", "Maybe", "Never"], "✅", "Afirmar con <b>Yes</b>.", "Yes, please"],
                ["No", "No", "____, thanks", ["No", "Yes", "Sure", "Always"], "❌", "Negar con <b>No</b>.", "No, sorry"],
                ["Buenos días", "Good morning", "____!", ["Good morning", "Good night", "Hello", "Hi"], "🌅", "Saludo matutino.", "Good morning!"],
                ["Hombre", "Man", "The ____", ["Man", "Woman", "Boy", "Girl"], "👨", "Vocabulario: Hombre.", "A tall man"],
                ["Mujer", "Woman", "The ____", ["Woman", "Man", "Girl", "Boy"], "👩", "Vocabulario: Mujer.", "A strong woman"],
                ["Niño", "Boy", "The ____", ["Boy", "Girl", "Man", "Woman"], "👦", "Vocabulario: Niño.", "A happy boy"],
                ["Niña", "Girl", "The ____", ["Girl", "Boy", "Woman", "Man"], "👧", "Vocabulario: Niña.", "A small girl"],
                ["Cuatro", "Four", "Number ____", ["Four", "Three", "Five", "Six"], "4️⃣", "El número cuatro.", "Four books"],
                ["Cinco", "Five", "Number ____", ["Five", "Four", "Six", "Seven"], "5️⃣", "El número cinco.", "Five stars"],
                ["Nombre", "name", "My ____ is...", ["name", "is", "I", "am"], "📛", "Preguntar o decir el nombre.", "My name is John"],
                ["Perro", "Dog", "My ____", ["Dog", "Cat", "Bird", "Fish"], "🐶", "Mascotas: Perro.", "I love my dog"],
                ["Gato", "Cat", "My ____", ["Cat", "Dog", "Bird", "Mouse"], "🐱", "Mascotas: Gato.", "The black cat"]
            ].map((d, i) => ({ id: 100 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 2, title: "La Ciudad", icon: "🏙️",
            levels: [
                ["Casa", "House", "My ____", ["House", "Car", "Street", "Park"], "🏠", "Donde vives.", "My big house"],
                ["Auto", "Car", "The red ____", ["Car", "Bus", "Train", "Plane"], "🚗", "Vehículo común.", "I have a car"],
                ["Calle", "Street", "On the ____", ["Street", "Road", "Way", "Path"], "🛣️", "Por donde caminas.", "Main street"],
                ["Parque", "Park", "At the ____", ["Park", "House", "School", "Bank"], "🌳", "Lugar verde.", "In the park"],
                ["Banco", "Bank", "Where is the ____?", ["Bank", "Cafe", "Park", "Store"], "🏦", "Donde está el dinero.", "The central bank"],
                ["Tienda", "Store", "A big ____", ["Store", "House", "Park", "Road"], "🏬", "Lugar para comprar.", "Apple store"],
                ["Escuela", "School", "Go to ____", ["School", "Store", "Bank", "Car"], "🏫", "Lugar de estudio.", "At school"],
                ["Hospital", "Hospital", "The nearest ____", ["Hospital", "Park", "Cafe", "Bank"], "🏥", "Salud.", "The city hospital"],
                ["Café", "Cafe", "Let's go to the ____", ["Cafe", "Store", "Bank", "Park"], "☕", "Lugar para beber café.", "I like this cafe"],
                ["Bus", "Bus", "Take the ____", ["Bus", "Car", "Bike", "Taxi"], "🚌", "Transporte público.", "The school bus"],
                ["Taxi", "Taxi", "Call a ____", ["Taxi", "Bus", "Bike", "Plane"], "🚕", "Transporte privado.", "Yellow taxi"],
                ["Bici", "Bike", "Ride a ____", ["Bike", "Bus", "Car", "Taxi"], "🚲", "Dos ruedas.", "My new bike"],
                ["Tren", "Train", "Fast ____", ["Train", "Bus", "Plane", "Car"], "🚆", "Vías de hierro.", "Morning train"],
                ["Avión", "Plane", "The ____", ["Plane", "Car", "Boat", "Bus"], "✈️", "Para volar.", "The blue plane"],
                ["Barco", "Boat", "The ____", ["Boat", "Car", "Bike", "Bus"], "🚢", "Por el agua.", "A big boat"],
                ["Hotel", "Hotel", "Luxury ____", ["Hotel", "House", "Bank", "Park"], "🏨", "Para dormir fuera.", "Stay at the hotel"],
                ["Cine", "Cinema", "At the ____", ["Cinema", "Park", "Store", "Bank"], "🎬", "Ver películas.", "Go to the cinema"],
                ["Puente", "Bridge", "Cross the ____", ["Bridge", "Road", "Street", "Way"], "🌉", "Une dos caminos.", "London bridge"],
                ["Museo", "Museum", "The art ____", ["Museum", "Store", "Park", "Bank"], "🏛️", "Historia y arte.", "Visit the museum"],
                ["Policía", "Police", "Call the ____", ["Police", "Doctor", "Fireman", "Nurse"], "🚓", "Seguridad.", "Police station"]
            ].map((d, i) => ({ id: 200 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 3, title: "El Restaurante", icon: "🍕",
            levels: [
                ["Agua", "Water", "A glass of ____", ["Water", "Wine", "Juice", "Milk"], "💧", "Bebida básica.", "I need water"],
                ["Pan", "Bread", "Butter and ____", ["Bread", "Cake", "Meat", "Rice"], "🍞", "Para acompañar.", "Fresh bread"],
                ["Pizza", "Pizza", "I like ____", ["Pizza", "Pasta", "Soup", "Salad"], "🍕", "Comida italiana.", "One pizza, please"],
                ["Carne", "Meat", "Eat ____", ["Meat", "Fruit", "Bread", "Sugar"], "🥩", "Proteína.", "Roasted meat"],
                ["Fruta", "Fruit", "Fresh ____", ["Fruit", "Meat", "Bread", "Rice"], "🍎", "Sano y dulce.", "Eat more fruit"],
                ["Arroz", "Rice", "Chicken and ____", ["Rice", "Bread", "Pasta", "Meat"], "🍚", "Grano común.", "White rice"],
                ["Ensalada", "Salad", "Green ____", ["Salad", "Pizza", "Soup", "Meat"], "🥗", "Vegetales mixtos.", "A fresh salad"],
                ["Sopa", "Soup", "Hot ____", ["Soup", "Salad", "Pizza", "Pasta"], "🥣", "Líquido caliente.", "Tomato soup"],
                ["Pasta", "Pasta", "Italian ____", ["Pasta", "Pizza", "Soup", "Rice"], "🍝", "Fideos y más.", "I love pasta"],
                ["Leche", "Milk", "Coffee with ____", ["Milk", "Water", "Juice", "Wine"], "🥛", "Bebida blanca.", "Cold milk"],
                ["Vino", "Wine", "Red ____", ["Wine", "Water", "Milk", "Beer"], "🍷", "Bebida alcohólica.", "A glass of wine"],
                ["Cerveza", "Beer", "Cold ____", ["Beer", "Wine", "Water", "Milk"], "🍺", "Bebida de cebada.", "Two beers, please"],
                ["Té", "Tea", "Hot ____", ["Tea", "Coffee", "Milk", "Water"], "🍵", "Infusión.", "Green tea"],
                ["Huevo", "Egg", "Fried ____", ["Egg", "Bread", "Meat", "Fruit"], "🥚", "Desayuno común.", "An egg, please"],
                ["Queso", "Cheese", "Ham and ____", ["Cheese", "Bread", "Meat", "Fruit"], "🧀", "Producto lácteo.", "I love cheese"],
                ["Pescado", "Fish", "Grilled ____", ["Fish", "Meat", "Chicken", "Beef"], "🐟", "Del mar.", "Fresh fish"],
                ["Pollo", "Chicken", "Fried ____", ["Chicken", "Meat", "Fish", "Beef"], "🍗", "Ave común.", "Chicken and fries"],
                ["Postre", "Dessert", "Chocolate ____", ["Dessert", "Meat", "Soup", "Salad"], "🍰", "Algo dulce al final.", "What's for dessert?"],
                ["Cena", "Dinner", "Eat ____", ["Dinner", "Lunch", "Breakfast", "Snack"], "🍽️", "Comida nocturna.", "Let's have dinner"],
                ["Cuenta", "Bill", "The ____, please", ["Bill", "Menu", "Table", "Food"], "💵", "Para pagar.", "Can I have the bill?"]
            ].map((d, i) => ({ id: 300 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 4, title: "Viajes", icon: "✈️",
            levels: [
                ["Maleta", "Suitcase", "My ____", ["Suitcase", "Bag", "Passport", "Ticket"], "🧳", "Para llevar ropa.", "Pack the suitcase"],
                ["Pasaporte", "Passport", "Show your ____", ["Passport", "Ticket", "ID", "Money"], "🛂", "Documento de viaje.", "My passport is ready"],
                ["Boleto", "Ticket", "Train ____", ["Ticket", "Money", "Bag", "Map"], "🎟️", "Para entrar.", "I have the ticket"],
                ["Mapa", "Map", "Look at the ____", ["Map", "Book", "Street", "Park"], "🗺️", "Para no perderse.", "Where is the map?"],
                ["Dinero", "Money", "Easy ____", ["Money", "Ticket", "Bag", "Gift"], "💵", "Para comprar.", "I need money"],
                ["Cámara", "Camera", "Take a ____", ["Camera", "Phone", "Photo", "Bag"], "📷", "Para fotos.", "Smile for the camera"],
                ["Playa", "Beach", "At the ____", ["Beach", "Mountain", "Forest", "Desert"], "🏖️", "Arena y mar.", "I love the beach"],
                ["Montaña", "Mountain", "High ____", ["Mountain", "Beach", "River", "Lake"], "⛰️", "Naturaleza alta.", "Climb the mountain"],
                ["Bosque", "Forest", "Green ____", ["Forest", "Beach", "Desert", "City"], "🌲", "Muchos árboles.", "In the forest"],
                ["Río", "River", "Cold ____", ["River", "Sea", "Lake", "Pool"], "🏞️", "Agua corriente.", "Near the river"],
                ["Mar", "Sea", "Blue ____", ["Sea", "River", "Lake", "Pool"], "🌊", "Agua salada.", "Deep blue sea"],
                ["Lago", "Lake", "Quiet ____", ["Lake", "Sea", "River", "Rain"], "🛶", "Agua tranquila.", "A beautiful lake"],
                ["Desierto", "Desert", "Hot ____", ["Desert", "Forest", "Beach", "Mountain"], "🌵", "Mucha arena y sol.", "The Sahara desert"],
                ["Isla", "Island", "Tropical ____", ["Island", "Land", "City", "Village"], "🏝️", "Tierra rodeada de agua.", "A private island"],
                ["Ciudad", "City", "Big ____", ["City", "Village", "Town", "Farm"], "🏙️", "Muchos edificios.", "New York City"],
                ["Pueblo", "Village", "Small ____", ["Village", "City", "Capital", "State"], "🏡", "Lugar pequeño.", "I live in a village"],
                ["Mundo", "World", "The ____", ["World", "Planet", "Earth", "Map"], "🌍", "Donde vivimos todos.", "Travel the world"],
                ["Sol", "Sun", "The ____", ["Sun", "Moon", "Stars", "Sky"], "☀️", "Luz del día.", "The sun is hot"],
                ["Luna", "Moon", "Full ____", ["Moon", "Sun", "Stars", "Sky"], "🌙", "Luz de noche.", "Look at the moon"],
                ["Estrellas", "Stars", "Many ____", ["Stars", "Suns", "Moons", "Clouds"], "✨", "Puntos de luz.", "The stars are bright"]
            ].map((d, i) => ({ id: 400 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 5, title: "Profesiones", icon: "💼",
            levels: [
                ["Doctor", "Doctor", "See a ____", ["Doctor", "Nurse", "Chef", "Pilot"], "👨‍⚕️", "Cura a las personas.", "He is a doctor"],
                ["Chef", "Chef", "A great ____", ["Chef", "Doctor", "Driver", "Farmer"], "👨‍🍳", "Cocina comida rica.", "The restaurant chef"],
                ["Piloto", "Pilot", "Plane ____", ["Pilot", "Driver", "Doctor", "Chef"], "👨‍✈️", "Vuela aviones.", "The pilot is ready"],
                ["Granjero", "Farmer", "Work on a farm", ["Farmer", "Chef", "Nurse", "Doctor"], "👨‍🌾", "Trabaja en el campo.", "The farmer has cows"],
                ["Policía", "Police", "Call the ____", ["Police", "Chef", "Pilot", "Doctor"], "👮", "Mantiene la ley.", "The police officer"],
                ["Bombero", "Firefighter", "Call the ____", ["Firefighter", "Police", "Chef", "Pilot"], "👩‍🚒", "Apaga incendios.", "A brave firefighter"],
                ["Maestro", "Teacher", "My ____", ["Teacher", "Doctor", "Pilot", "Chef"], "👩‍🏫", "Enseña cosas nuevas.", "My English teacher"],
                ["Enfermera", "Nurse", "The ____ help", ["Nurse", "Doctor", "Chef", "Pilot"], "👩‍⚕️", "Ayuda en el hospital.", "A kind nurse"],
                ["Conductor", "Driver", "Taxi ____", ["Driver", "Pilot", "Chef", "Doctor"], "👨‍🚀", "Maneja vehículos.", "A bus driver"],
                ["Artista", "Artist", "A famous ____", ["Artist", "Chef", "Doctor", "Pilot"], "🎨", "Crea arte.", "A talented artist"],
                ["Abogado", "Lawyer", "See a ____", ["Lawyer", "Doctor", "Chef", "Pilot"], "⚖️", "Defiende personas.", "My lawyer is good"],
                ["Dentista", "Dentist", "Go to the ____", ["Dentist", "Doctor", "Nurse", "Chef"], "🦷", "Cuida los dientes.", "I hate the dentist"],
                ["Cantante", "Singer", "A pop ____", ["Singer", "Artist", "Chef", "Pilot"], "🎤", "Canta canciones.", "My favorite singer"],
                ["Bailarín", "Dancer", "Ballet ____", ["Dancer", "Singer", "Artist", "Chef"], "💃", "Baila profesionalmente.", "A fast dancer"],
                ["Escritor", "Writer", "A book ____", ["Writer", "Artist", "Teacher", "Chef"], "✍️", "Escribe libros.", "A mystery writer"],
                ["Fotógrafo", "Photographer", "Professional ____", ["Photographer", "Artist", "Chef", "Pilot"], "📷", "Toma fotos.", "The wedding photographer"],
                ["Ingeniero", "Engineer", "Software ____", ["Engineer", "Doctor", "Chef", "Pilot"], "🏗️", "Diseña y construye.", "A civil engineer"],
                ["Científico", "Scientist", "Lab ____", ["Scientist", "Doctor", "Chef", "Teacher"], "🧪", "Investiga la ciencia.", "A crazy scientist"],
                ["Astronauta", "Astronaut", "Space ____", ["Astronaut", "Pilot", "Chef", "Doctor"], "🚀", "Viaja al espacio.", "The first astronaut"],
                ["Atleta", "Athlete", "Olympic ____", ["Athlete", "Singer", "Farmer", "Doctor"], "🏃", "Practica deportes.", "A strong athlete"]
            ].map((d, i) => ({ id: 500 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 6, title: "Cuerpo y Salud", icon: "🏥",
            levels: [
                ["Cabeza", "Head", "My ____ hurts", ["Head", "Hand", "Foot", "Arm"], "👤", "Parte superior.", "Touch your head"],
                ["Ojo", "Eye", "Blue ____", ["Eye", "Ear", "Nose", "Mouth"], "👁️", "Para ver.", "A big eye"],
                ["Oreja", "Ear", "Listen with your ____", ["Ear", "Eye", "Nose", "Mouth"], "👂", "Para oír.", "Left ear"],
                ["Nariz", "Nose", "My ____", ["Nose", "Ear", "Eye", "Mouth"], "👃", "Para oler.", "A small nose"],
                ["Boca", "Mouth", "Open your ____", ["Mouth", "Nose", "Ear", "Eye"], "👄", "Para hablar.", "A red mouth"],
                ["Mano", "Hand", "Wash your ____", ["Hand", "Foot", "Arm", "Leg"], "✋", "Para tocar.", "Give a hand"],
                ["Pie", "Foot", "Left ____", ["Foot", "Hand", "Arm", "Leg"], "🦶", "Para caminar.", "On one foot"],
                ["Brazo", "Arm", "Strong ____", ["Arm", "Leg", "Hand", "Foot"], "💪", "Extremidad superior.", "My right arm"],
                ["Pierna", "Leg", "Long ____", ["Leg", "Arm", "Hand", "Foot"], "🦵", "Extremidad inferior.", "Break a leg"],
                ["Corazón", "Heart", "Pure ____", ["Heart", "Stomach", "Head", "Hand"], "❤️", "Bómbea sangre.", "A cold heart"],
                ["Dedo", "Finger", "Ring ____", ["Finger", "Toe", "Hand", "Foot"], "☝️", "En la mano.", "Ten fingers"],
                ["Espalda", "Back", "My ____", ["Back", "Chest", "Arm", "Leg"], "🧍", "Parte posterior.", "A sore back"],
                ["Dolor", "Pain", "A lot of ____", ["Pain", "Health", "Medicine", "Doctor"], "🤕", "Sensación mala.", "In much pain"],
                ["Salud", "Health", "Good ____", ["Health", "Pain", "Medicine", "Doctor"], "🍏", "Estar bien.", "Health is wealth"],
                ["Medicina", "Medicine", "Take your ____", ["Medicine", "Food", "Water", "Milk"], "💊", "Para curarse.", "The doctor's medicine"],
                ["Sangre", "Blood", "Red ____", ["Blood", "Water", "Milk", "Juice"], "🩸", "Líquido vital.", "Blood bank"],
                ["Hueso", "Bone", "Broken ____", ["Bone", "Blood", "Pain", "Health"], "🦴", "Parte dura interna.", "A strong bone"],
                ["Cuerpo", "Body", "Human ____", ["Body", "Head", "Hand", "Foot"], "🧍", "Todo nosotros.", "A healthy body"],
                ["Sueño", "Sleep", "Need to ____", ["Sleep", "Eat", "Drink", "Play"], "😴", "Descansar de noche.", "Go to sleep"],
                ["Vida", "Life", "Long ____", ["Life", "Health", "Pain", "Body"], "🌱", "Estar vivos.", "A good life"]
            ].map((d, i) => ({ id: 600 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 7, title: "Clima y Tiempo", icon: "☁️",
            levels: [
                ["Sol", "Sun", "The hot ____", ["Sun", "Moon", "Rain", "Snow"], "☀️", "Luz del día.", "The sun is hot"],
                ["Lluvia", "Rain", "Cold ____", ["Rain", "Sun", "Snow", "Wind"], "🌧️", "Agua del cielo.", "I love rain"],
                ["Nieve", "Snow", "White ____", ["Snow", "Rain", "Sun", "Wind"], "❄️", "Agua helada.", "First snow"],
                ["Viento", "Wind", "Strong ____", ["Wind", "Rain", "Sun", "Snow"], "💨", "Aire en movimiento.", "The wind blows"],
                ["Nube", "Cloud", "White ____", ["Cloud", "Sun", "Rain", "Moon"], "☁️", "Mucha agua arriba.", "One big cloud"],
                ["Cielo", "Sky", "Blue ____", ["Sky", "Cloud", "Sun", "Moon"], "🌌", "Arriba nuestro.", "Clear sky"],
                ["Calor", "Hot", "It is ____", ["Hot", "Cold", "Rain", "Snow"], "🔥", "Mucho sol.", "A hot day"],
                ["Frío", "Cold", "It is ____", ["Cold", "Hot", "Sun", "Wind"], "🥶", "Poca temperatura.", "Cold water"],
                ["Tormenta", "Storm", "Big ____", ["Storm", "Rain", "Cloud", "Wind"], "⛈️", "Lluvia y rayos.", "A summer storm"],
                ["Clima", "Weather", "Good ____", ["Weather", "Sun", "Rain", "Day"], "🌍", "Estado del aire.", "What's the weather?"],
                ["Día", "Day", "A sunny ____", ["Day", "Night", "Morning", "Evening"], "☀️", "Luz.", "Have a nice day"],
                ["Noche", "Night", "Starry ____", ["Night", "Day", "Morning", "Evening"], "🌙", "Oscuridad.", "Good night"],
                ["Mañana", "Morning", "Good ____", ["Morning", "Night", "Day", "Evening"], "🌅", "Primeras horas.", "In the morning"],
                ["Tarde", "Afternoon", "Good ____", ["Afternoon", "Morning", "Night", "Day"], "🌤️", "Horas medias.", "Every afternoon"],
                ["Semana", "Week", "Last ____", ["Week", "Month", "Year", "Day"], "📅", "Siete días.", "Next week"],
                ["Mes", "Month", "This ____", ["Month", "Week", "Year", "Day"], "🗓️", "Treinta días.", "Every month"],
                ["Año", "Year", "New ____", ["Year", "Month", "Week", "Day"], "🎉", "Doce meses.", "Happy New Year"],
                ["Hora", "Hour", "One ____", ["Hour", "Minute", "Second", "Day"], "⏰", "Sesenta minutos.", "Wait an hour"],
                ["Minuto", "Minute", "Five ____", ["Minute", "Hour", "Second", "Day"], "⏱️", "Sesenta segundos.", "One minute, please"],
                ["Segunda", "Second", "Wait a ____", ["Second", "Minute", "Hour", "Day"], "⌛", "Tiempo muy corto.", "Wait a second"]
            ].map((d, i) => ({ id: 700 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 8, title: "Ropa y Tienda", icon: "🛍️",
            levels: [
                ["Camisa", "Shirt", "Blue ____", ["Shirt", "Pants", "Dress", "Shoe"], "👕", "Ropa de arriba.", "A cotton shirt"],
                ["Pantalón", "Pants", "Long ____", ["Pants", "Shirt", "Dress", "Shoe"], "👖", "Ropa de piernas.", "Blue pants"],
                ["Vestido", "Dress", "Red ____", ["Dress", "Shirt", "Pants", "Shoe"], "👗", "Ropa de fiesta.", "A beautiful dress"],
                ["Zapato", "Shoe", "Black ____", ["Shoe", "Shirt", "Pants", "Dress"], "👞", "Para los pies.", "Run in shoes"],
                ["Gorra", "Hat", "Cool ____", ["Hat", "Shirt", "Pants", "Dress"], "🧢", "Para la cabeza.", "Wear a hat"],
                ["Ropa", "Clothes", "New ____", ["Clothes", "Shoes", "Bags", "Hat"], "👗", "Todo lo que usamos.", "Clean clothes"],
                ["Precio", "Price", "High ____", ["Price", "Money", "Bill", "Cost"], "💰", "Lo que cuesta.", "The best price"],
                ["Barato", "Cheap", "Very ____", ["Cheap", "Expensive", "New", "Old"], "🏷️", "Cuesta poco.", "Cheap food"],
                ["Caro", "Expensive", "It is ____", ["Expensive", "Cheap", "New", "Old"], "💎", "Cuesta mucho.", "An expensive car"],
                ["Comprar", "Buy", "Want to ____", ["Buy", "Sell", "Give", "Take"], "🛒", "Adquirir algo.", "Buy a gift"],
                ["Vender", "Sell", "Want to ____", ["Sell", "Buy", "Give", "Take"], "🏪", "Dar por dinero.", "Sell my car"],
                ["Chaqueta", "Jacket", "Winter ____", ["Jacket", "Shirt", "Coat", "Dress"], "🧥", "Para el frío.", "A warm jacket"],
                ["Calcetín", "Sock", "Left ____", ["Sock", "Shoe", "Pants", "Shirt"], "🧦", "Debajo del zapato.", "A white sock"],
                ["Gafas", "Glasses", "Sun ____", ["Glasses", "Hat", "Ring", "Watch"], "🕶️", "Para los ojos.", "Wear glasses"],
                ["Reloj", "Watch", "Wrist ____", ["Watch", "Clock", "Ring", "Hat"], "⌚", "Para ver la hora.", "A silver watch"],
                ["Bolso", "Bag", "Hand ____", ["Bag", "Box", "Case", "Pocket"], "👜", "Para llevar cosas.", "Carry a bag"],
                ["Cinturón", "Belt", "Leather ____", ["Belt", "Pants", "Shirt", "Dress"], "🎗️", "Para ajustar.", "A black belt"],
                ["Traje", "Suit", "Black ____", ["Suit", "Shirt", "Pants", "Dress"], "👔", "Ropa formal.", "Wear a suit"],
                ["Bufanda", "Scarf", "Long ____", ["Scarf", "Hat", "Coat", "Glove"], "🧣", "Para el cuello.", "A wool scarf"],
                ["Guantes", "Gloves", "Pair of ____", ["Gloves", "Socks", "Shoes", "Hats"], "🧤", "Para las manos.", "Cold hands, warm gloves"]
            ].map((d, i) => ({ id: 800 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 9, title: "Entretenimiento", icon: "🎮",
            levels: [
                ["Juego", "Game", "New ____", ["Game", "Play", "Sport", "Work"], "🎮", "Para divertirse.", "A fun game"],
                ["Cine", "Cinema", "Go to ____", ["Cinema", "Store", "Bank", "Park"], "🎬", "Ver películas.", "At the cinema"],
                ["Cuento", "Story", "Tell a ____", ["Story", "Song", "Game", "Play"], "📚", "Narración.", "A bedtime story"],
                ["Música", "Music", "Listen to ____", ["Music", "Sound", "Noise", "Voice"], "🎵", "Sonidos rítmicos.", "Soft music"],
                ["Baile", "Dance", "Let's ____", ["Dance", "Sing", "Play", "Run"], "💃", "Mover el cuerpo.", "Learn to dance"],
                ["Fiesta", "Party", "Birthday ____", ["Party", "Work", "School", "Home"], "🥳", "Celebración.", "A big party"],
                ["Película", "Movie", "Scary ____", ["Movie", "Book", "Song", "Game"], "🎥", "Historia visual.", "Watch a movie"],
                ["Radio", "Radio", "On the ____", ["Radio", "Phone", "TV", "Web"], "📻", "Para oír noticias.", "Listen to the radio"],
                ["Tele", "TV", "Watch ____", ["TV", "Radio", "Book", "Game"], "📺", "Televisión.", "Turn on the TV"],
                ["Libro", "Book", "Read a ____", ["Book", "Pen", "Page", "Desk"], "📖", "Hojas escritas.", "A long book"],
                ["Actor", "Actor", "Famous ____", ["Actor", "Singer", "Artist", "Doctor"], "🎭", "Actúa en cine.", "A Hollywood actor"],
                ["Pintura", "Painting", "Oil ____", ["Painting", "Photo", "Drawing", "Art"], "🎨", "Arte con pincel.", "A beautiful painting"],
                ["Dibujo", "Drawing", "Pen ____", ["Drawing", "Painting", "Photo", "Art"], "✏️", "Arte con lápiz.", "Make a drawing"],
                ["Museo", "Museum", "History ____", ["Museum", "Cinema", "Store", "Park"], "🏛️", "Donde hay arte.", "Visit the museum"],
                ["Teatro", "Theater", "Old ____", ["Theater", "Cinema", "Store", "Park"], "🏟️", "Obras en vivo.", "At the theater"],
                ["Concierto", "Concert", "Rock ____", ["Concert", "Movie", "Game", "Party"], "🎸", "Música en vivo.", "Go to a concert"],
                ["Piano", "Piano", "Play ____", ["Piano", "Guitar", "Drum", "Violin"], "🎹", "Instrumento de teclas.", "The grand piano"],
                ["Guitarra", "Guitar", "Electric ____", ["Guitar", "Piano", "Drum", "Violin"], "🎸", "Instrumento de cuerdas.", "A loud guitar"],
                ["Tambor", "Drum", "Play the ____", ["Drum", "Piano", "Guitar", "Violin"], "🥁", "Instrumento de percusión.", "A big drum"],
                ["Violín", "Violin", "Classic ____", ["Violin", "Piano", "Guitar", "Drum"], "🎻", "Instrumento delicado.", "The small violin"]
            ].map((d, i) => ({ id: 900 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 10, title: "Deporte y Ocio", icon: "⚽",
            levels: [
                ["Fútbol", "Soccer", "Play ____", ["Soccer", "Tennis", "Golf", "Run"], "⚽", "Con los pies.", "American soccer"],
                ["Tenis", "Tennis", "Play ____", ["Tennis", "Soccer", "Golf", "Run"], "🎾", "Con raqueta.", "Play tennis"],
                ["Correr", "Run", "I like to ____", ["Run", "Swim", "Walk", "Jump"], "🏃", "Ir rápido a pie.", "Run fast"],
                ["Nadar", "Swim", "In the pool", ["Swim", "Run", "Walk", "Jump"], "🏊", "En el agua.", "Swim like a fish"],
                ["Golf", "Golf", "Play ____", ["Golf", "Tennis", "Soccer", "Run"], "⛳", "Con hoyos.", "A game of golf"],
                ["Bici", "Bicycle", "Ride a ____", ["Bicycle", "Car", "Bus", "Train"], "🚲", "Dos ruedas.", "My red bicycle"],
                ["Pelota", "Ball", "Kick the ____", ["Ball", "Bat", "Net", "Goal"], "⚽", "Redonda.", "A plastic ball"],
                ["Equipo", "Team", "Best ____", ["Team", "Player", "Game", "Win"], "👫", "Grupo unido.", "A strong team"],
                ["Ganar", "Win", "Want to ____", ["Win", "Lose", "Draw", "Play"], "🏆", "Ser el primero.", "Win the game"],
                ["Jugar", "Play", "Let's ____", ["Play", "Work", "Sleep", "Eat"], "🎮", "Hacer deporte.", "Play with friends"],
                ["Perder", "Lose", "Do not ____", ["Lose", "Win", "Draw", "Play"], "😢", "No ser primero.", "Do not lose"],
                ["Empate", "Draw", "It is a ____", ["Draw", "Win", "Lose", "Play"], "🤝", "Iguales.", "A fair draw"],
                ["Entrenar", "Train", "Need to ____", ["Train", "Play", "Work", "Rest"], "💪", "Practicar.", "Train hard"],
                ["Gimnasio", "Gym", "Go to the ____", ["Gym", "Store", "Bank", "Park"], "🏋️", "Hacer ejercicio.", "At the local gym"],
                ["Piscina", "Pool", "Blue ____", ["Pool", "Lake", "Sea", "River"], "🏊", "Donde nadas.", "A clean pool"],
                ["Estadio", "Stadium", "Big ____", ["Stadium", "Gym", "Park", "Cinema"], "🏟️", "Donde hay partidos.", "The city stadium"],
                ["Caminar", "Walk", "Take a ____", ["Walk", "Run", "Swim", "Jump"], "🚶", "Ir a pie.", "Walk in the park"],
                ["Saltar", "Jump", "I can ____", ["Jump", "Run", "Swim", "Walk"], "🦘", "Hacia arriba.", "Jump high"],
                ["Cantar", "Sing", "Try to ____", ["Sing", "Dance", "Speak", "Listen"], "🎤", "Voz musical.", "Sing a song"],
                ["Reír", "Laugh", "Always ____", ["Laugh", "Cry", "Smile", "Angry"], "😂", "Felicidad.", "Laugh out loud"]
            ].map((d, i) => ({ id: 1000 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 11, title: "Tecnología", icon: "💻",
            levels: [
                ["Compu", "Computer", "Fast ____", ["Computer", "Phone", "Radio", "TV"], "💻", "Para trabajar.", "My new computer"],
                ["Celular", "Phone", "Mobile ____", ["Phone", "Radio", "TV", "Web"], "📱", "En tu mano.", "Call me on the phone"],
                ["Internet", "Internet", "On the ____", ["Internet", "Radio", "TV", "Phone"], "🌐", "Mundo conectado.", "Search the internet"],
                ["Correo", "Email", "Send an ____", ["Email", "Letter", "Call", "Game"], "📧", "Mensaje digital.", "Check my email"],
                ["Web", "Website", "Visit a ____", ["Website", "Email", "Phone", "TV"], "🌍", "Sitio digital.", "A fast website"],
                ["Clave", "Password", "Safe ____", ["Password", "Name", "Mail", "Word"], "🔐", "Secreto.", "What is the password?"],
                ["Pantalla", "Screen", "Big ____", ["Screen", "Phone", "Mouse", "Key"], "📺", "Donde ves todo.", "A flat screen"],
                ["Teclado", "Keyboard", "Type on ____", ["Keyboard", "Mouse", "Screen", "Phone"], "⌨️", "Para escribir.", "A mechanical keyboard"],
                ["Ratón", "Mouse", "Computer ____", ["Mouse", "Screen", "Key", "Phone"], "🖱️", "Mueve flecha.", "A wireless mouse"],
                ["Código", "Code", "Write ____", ["Code", "Word", "Mail", "Call"], "⌨️", "Para programar.", "Learn to code"],
                ["Robot", "Robot", "Smart ____", ["Robot", "Man", "Dog", "Cat"], "🤖", "Hombre de metal.", "The small robot"],
                ["Espacio", "Space", "Outer ____", ["Space", "Sky", "Cloud", "Sun"], "🚀", "Estrellas y luna.", "Travel to space"],
                ["Nave", "Spaceship", "Fast ____", ["Spaceship", "Car", "Bus", "Train"], "🛸", "Vuela lejos.", "The silver spaceship"],
                ["Futuro", "Future", "Smart ____", ["Future", "Past", "Now", "Today"], "⏳", "Lo que vendrá.", "In the future"],
                ["Chip", "Chip", "Small ____", ["Chip", "Card", "Key", "Box"], "💾", "Cerebro digital.", "A silicon chip"],
                ["Cable", "Cable", "Long ____", ["Cable", "Wire", "Link", "Line"], "🔌", "Para corriente.", "Plug in the cable"],
                ["Batería", "Battery", "Full ____", ["Battery", "Power", "Low", "Life"], "🔋", "Energía.", "Charge the battery"],
                ["Wifi", "Wifi", "Free ____", ["Wifi", "Link", "Web", "Net"], "📶", "Señal sin hilos.", "Where is the wifi?"],
                ["App", "App", "Mobile ____", ["App", "Game", "Web", "Mail"], "📱", "Programa de móvil.", "Install the app"],
                ["Juego", "Game", "Video ____", ["Game", "App", "Web", "Mail"], "🎮", "Diversión digital.", "I love this game"]
            ].map((d, i) => ({ id: 1100 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        },
        {
            id: 12, title: "Sentimientos", icon: "🔥",
            levels: [
                ["Amor", "Love", "I ____ you", ["Love", "Hate", "Like", "Want"], "❤️", "Sentir mucho.", "True love"],
                ["Odio", "Hate", "Stop the ____", ["Hate", "Love", "Like", "Want"], "😠", "Sentir mal.", "Do not hate"],
                ["Feliz", "Happy", "Feel ____", ["Happy", "Sad", "Angry", "Fear"], "😊", "Estar bien.", "I am happy"],
                ["Triste", "Sad", "Don't be ____", ["Sad", "Happy", "Angry", "Fear"], "😢", "Estar mal.", "A sad day"],
                ["Enojo", "Angry", "Stop being ____", ["Angry", "Happy", "Sad", "Fear"], "😡", "Mucha rabia.", "The angry man"],
                ["Miedo", "Fear", "No ____", ["Fear", "Love", "Hope", "Joy"], "😨", "Susto.", "Face your fear"],
                ["Paz", "Peace", "World ____", ["Peace", "War", "Love", "Hope"], "🕊️", "Tranquilidad.", "Inner peace"],
                ["Guerra", "War", "Stop the ____", ["War", "Peace", "Love", "Hope"], "💣", "Conflicto.", "A long war"],
                ["Risa", "Laugh", "A big ____", ["Laugh", "Cry", "Smile", "Angry"], "😄", "Jajaja.", "A loud laugh"],
                ["Llantos", "Cry", "Don't ____", ["Cry", "Laugh", "Smile", "Angry"], "😭", "Lágrimas.", "Baby cry"],
                ["Deseo", "Want", "I ____ this", ["Want", "Like", "Need", "Have"], "💫", "Querer algo.", "I want more"],
                ["Gusto", "Like", "I ____ food", ["Like", "Love", "Want", "Need"], "👍", "Agradar.", "I like pizza"],
                ["Necesidad", "Need", "I ____ water", ["Need", "Want", "Like", "Have"], "🆘", "Ser urgente.", "You need help"],
                ["Tener", "Have", "I ____ a car", ["Have", "Need", "Want", "Like"], "🤲", "Posesión.", "I have a house"],
                ["Ser", "Be", "Just ____", ["Be", "Have", "Need", "Want"], "🧘", "Existir.", "To be or not to be"],
                ["Amigo", "Friend", "Best ____", ["Friend", "Enemy", "Boy", "Girl"], "👫", "Persona cercana.", "A good friend"],
                ["Enemigo", "Enemy", "Kill the ____", ["Enemy", "Friend", "Man", "Woman"], "🦹", "Persona contraria.", "Stay away from enemy"],
                ["Familia", "Family", "Big ____", ["Family", "Friend", "Team", "Group"], "👨‍👩‍👧‍👦", "Parientes.", "I love my family"],
                ["Hogar", "Home", "Going ____", ["Home", "House", "Store", "Work"], "🏠", "Donde vives.", "Home sweet home"],
                ["Mundo", "World", "The entire ____", ["World", "Home", "City", "Land"], "🌍", "Todo el planeta.", "Save the world"]
            ].map((d, i) => ({ id: 1200 + i + 1, num: i + 1, isPro: i >= 10, title: d[0], ans: d[1], code: d[2], opts: d[3], ic: d[4], theory: { text: d[5], example: d[6], voice: d[6] }, questions: [{ type: "translate", text: `¿Cómo se dice '${d[0]}'?`, answer: d[1], options: d[3], voice: d[1] }] }))
        }
    ]
};

// === VOCES (WEB SPEECH API) ===
function speak(text, lang = 'en-US') {
    if (!window.speechSynthesis) return;
    // Cancelar cualquier voz previa
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Un poco más lento para aprender
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// === NAVEGACIÓN ===
// === NAVEGACIÓN ===
window.jumpToUnit = (unitId) => {
    const target = document.getElementById(`unit-header-${unitId}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

function showView(viewId) {
    document.querySelectorAll('.app-container > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    state.view = viewId;
    window.scrollTo(0, 0);
}

// === RENDERIZADO DEL MAPA ===
function renderMap() {
    const mainArea = document.querySelector('.map-scroll-area');
    mainArea.innerHTML = ''; // Limpiamos todo para re-generar

    courseData.units.forEach((unit, uIdx) => {
        // Branding de Unidad
        const header = document.createElement('div');
        header.className = 'map-header-branding';
        header.id = `unit-header-${unit.id}`; // ID para scroll
        header.innerHTML = `
            <span class="logo-icon-small">${unit.icon}</span>
            <h2>${unit.title}</h2>
            <p>Misión: Unidad ${unit.id}</p>
        `;
        mainArea.appendChild(header);

        const pathContainer = document.createElement('div');
        pathContainer.className = 'path-container';

        unit.levels.forEach((lvl, lIdx) => {
            const isCompleted = state.completedLevels.includes(lvl.id);

            // Lógica de bloqueo estilo GDScript:
            // 1. Si el nivel es PRO y el usuario NO es Pro, se bloquea (se muestra Diamante).
            // 2. Si NO es Pro (o el usuario es Pro), el nivel está SIEMPRE abierto (se muestra Emoji).

            const isProLocked = lvl.isPro && !state.isPro;

            const node = document.createElement('div');
            node.className = `level-node ${isCompleted ? 'completed' : ''} ${isProLocked ? 'locked' : ''}`;

            if (isProLocked) {
                node.innerHTML = '💎';
                node.onclick = () => {
                    document.getElementById('payment-modal').classList.remove('hidden');
                };
            } else {
                // Nivel Abierto o Completado: Mostramos su EMOJI temático
                node.innerHTML = lvl.ic;
                node.onclick = () => startLevel(lvl);

                // Si es el primer nivel no completado, le damos un toque especial (opcional)
                if (!isCompleted && !state.completedLevels.some(id => unit.levels.map(l => l.id).includes(id) && id > lvl.id)) {
                    node.classList.add('current');
                }
            }

            pathContainer.appendChild(node);

            // Si llegamos a la mitad (Lección 11), ponemos un separador visual de PRO
            if (lIdx === 9) {
                const sep = document.createElement('div');
                sep.className = 'pro-separator';
                sep.innerHTML = '<span>Zona Premium Lingua Pro</span>';
                pathContainer.appendChild(sep);
            }
        });

        mainArea.appendChild(pathContainer);

        // Divisor entre unidades
        if (uIdx < courseData.units.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'path-divider';
            divider.innerHTML = `<span>Siguiente: ${courseData.units[uIdx + 1].title}</span>`;
            mainArea.appendChild(divider);
        }
    });
}

// === LÓGICA DE LECCIÓN ===
let currentQuiz = null;
let quizIndex = 0;
let selectedTitle = "";

function startLevel(level) {
    state.currentLevel = level;
    state.lives = 5;
    quizIndex = 0;
    updateLessonUI();

    // Mostrar Teoría Primero
    const theory = level.theory;
    document.getElementById('theory-title').innerText = level.title;
    document.getElementById('theory-text').innerHTML = theory.text;
    document.getElementById('theory-code').innerText = theory.example;

    document.getElementById('play-theory-audio').onclick = () => speak(theory.voice);

    showView('theory');
}

document.getElementById('start-quiz-btn').onclick = () => {
    showView('lesson');
    loadQuestion();
};

function loadQuestion() {
    const questions = state.currentLevel.questions;
    if (quizIndex >= questions.length) {
        finishLevel();
        return;
    }

    const q = questions[quizIndex];
    currentQuiz = q;

    // Limpiar UI
    document.getElementById('question-text').innerText = q.text;
    document.getElementById('feedback-msg').classList.add('hidden');
    document.getElementById('footer-bar').className = 'bottom-bar';
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    document.getElementById('check-btn').disabled = true;

    const container = document.getElementById('options-container');
    const challengeBox = document.getElementById('challenge-box');
    container.innerHTML = '';
    challengeBox.innerHTML = '';

    // Configurar Botón de Audio
    document.getElementById('play-question-audio').onclick = () => speak(q.voice);

    if (q.type === 'translate') {
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'action-btn option-btn';
            btn.style.width = 'auto'; // Ajuste manual para el grid
            btn.style.background = '#fff';
            btn.style.color = '#333';
            btn.style.border = '2px solid #ddd';
            btn.style.boxShadow = '0 4px 0 #ddd';
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                btn.style.borderColor = '#8a3ffc';
                document.getElementById('check-btn').disabled = false;
                selectedTitle = opt;
            };
            container.appendChild(btn);
        });
    } else if (q.type === 'bubbles') {
        let currentAnswer = [];
        q.options.forEach(opt => {
            const bubble = document.createElement('div');
            bubble.className = 'word-bubble';
            bubble.innerText = opt;
            bubble.onclick = () => {
                if (bubble.parentElement === container) {
                    challengeBox.appendChild(bubble);
                    currentAnswer.push(opt);
                } else {
                    container.appendChild(bubble);
                    currentAnswer = currentAnswer.filter(i => i !== opt);
                }
                document.getElementById('check-btn').disabled = currentAnswer.length === 0;
                selectedTitle = currentAnswer;
            };
            container.appendChild(bubble);
        });
    }

    updateProgress();
}

function updateProgress() {
    const total = state.currentLevel.questions.length;
    const perc = (quizIndex / total) * 100;
    document.getElementById('progress-bar').style.width = `${perc}%`;
}

function updateLessonUI() {
    document.getElementById('lives-count').innerText = state.lives;
    document.getElementById('gems-count').innerText = state.gems;
    document.getElementById('streak-count').innerText = state.streak;

    // Actualizar badge Pro si ya es pro
    const proStatusTag = document.getElementById('pro-status-tag');
    const proBadge = document.querySelector('.pro-badge');

    if (state.isPro) {
        if (proStatusTag) proStatusTag.classList.remove('hidden');
        if (proBadge) {
            proBadge.innerText = 'PRO ACTIVO';
            proBadge.style.background = 'linear-gradient(45deg, #8a3ffc, #1192e8)';
            proBadge.style.color = 'white';
            proBadge.style.boxShadow = '0 4px 0 #6929c4';
        }
    } else {
        if (proStatusTag) proStatusTag.classList.add('hidden');
        if (proBadge) {
            proBadge.innerText = 'LINGUA PRO';
            proBadge.style.background = ''; // Vuelve al gradiente de CSS
            proBadge.style.color = '';
            proBadge.style.boxShadow = '';
        }
    }
}


document.getElementById('check-btn').onclick = () => {
    const q = currentQuiz;
    let isCorrect = false;

    if (q.type === 'translate') {
        isCorrect = (selectedTitle === q.answer);
    } else if (q.type === 'bubbles') {
        isCorrect = (JSON.stringify(selectedTitle) === JSON.stringify(q.answer));
    }

    const footer = document.getElementById('footer-bar');
    const feedback = document.getElementById('feedback-msg');
    const title = document.getElementById('feedback-title');
    const detail = document.getElementById('feedback-detail');

    footer.classList.remove('hidden');
    feedback.classList.remove('hidden');

    if (isCorrect) {
        footer.className = 'bottom-bar correct';
        title.innerText = "¡Excelente!";
        detail.innerText = "Sigue así.";
        speak(q.voice); // Refuerzo auditivo al acertar
    } else {
        footer.className = 'bottom-bar wrong';
        title.innerText = "Casi...";
        detail.innerText = `La respuesta era: ${Array.isArray(q.answer) ? q.answer.join(' ') : q.answer}`;
        state.lives--;
        if (state.lives <= 0) {
            alert("Te quedaste sin vidas. Intenta de nuevo.");
            showView('map');
            return;
        }
    }

    updateLessonUI();
    document.getElementById('check-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
};

document.getElementById('next-btn').onclick = () => {
    quizIndex++;
    loadQuestion();
};

function finishLevel() {
    if (!state.completedLevels.includes(state.currentLevel.id)) {
        state.completedLevels.push(state.currentLevel.id);
        state.gems += 10;
        state.streak++;
    }
    localStorage.setItem('lingua_completed', JSON.stringify(state.completedLevels));
    localStorage.setItem('lingua_gems', state.gems);
    localStorage.setItem('lingua_streak', state.streak);

    alert("¡Nivel Completado! +10 Gemas 💎");
    renderMap();
    showView('map');
}

// === INICIALIZACIÓN ===
document.getElementById('start-learning-btn').onclick = () => {
    showView('map');
    renderMap();
};

document.getElementById('exit-lesson-btn').onclick = () => {
    if (confirm("¿Seguro que quieres salir? Perderás el progreso de la lección.")) {
        showView('map');
    }
};

document.getElementById('back-to-map-btn').onclick = () => showView('map');

// Modal Pro Mock
document.querySelector('.pro-badge').onclick = () => {
    document.getElementById('payment-modal').classList.remove('hidden');
};
document.getElementById('verify-code-btn').onclick = () => {
    const inputField = document.getElementById('manual-code-input');
    const code = inputField.value.trim();
    if (code === "LINGUA2025" || code === "cliente_vip_enero_2026") {
        state.isPro = true;
        localStorage.setItem('lingua_pro', 'true');
        alert("¡Felicidades! Lingua Dojo PRO Activado.");
        updateLessonUI();
        renderMap();
        document.getElementById('payment-modal').classList.add('hidden');
    } else if (code === "") {
        alert("Por favor, ingresa un código.");
    } else {
        alert("Código inválido.");
    }
};


document.querySelector('.close-modal-pay').onclick = () => {
    document.getElementById('payment-modal').classList.add('hidden');
};

// Cerrar al hacer clic fuera del contenido del modal
window.onclick = (event) => {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
};

// Start
// Lógica de Modo Oscuro
const darkModeBtn = document.getElementById('dark-mode-btn');
const isDarkMode = localStorage.getItem('lingua_theme') === 'dark';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerText = '☀️';
}

darkModeBtn.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('lingua_theme', isDark ? 'dark' : 'light');
    darkModeBtn.innerText = isDark ? '☀️' : '🌙';
};

// Lógica para detectar acceso VIP por URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('access') === 'cliente_vip_enero_2026') {
    state.isPro = true;
    localStorage.setItem('lingua_pro', 'true');
    console.log("Acceso PRO activado vía URL");
}

updateLessonUI();
renderMap();

// Drag to scroll para el navegador de unidades (Mouse)
const slider = document.querySelector('.units-nav');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Velocidad del scroll
    slider.scrollLeft = scrollLeft - walk;
});
