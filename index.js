
const express = require('express'); 
const uri = "mongodb+srv://FezeSteve:Huguette199023@cluster0.aeeum4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const fs = require('fs'); 
const app = express(); 
const port = 3000; 
const {MongoClient, ObjectId} = require('mongodb');
const client = new MongoClient(uri, { useUnifiedTopology: true });
const path = require('path');
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));



app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write(data);
    return res.end();
  });

  
}); 



// enregistrer un voyage

app.post('/register', async (req, res) => {
    try {
        console.log(req.body); 
        
        // Extraction des données du formulaire
        const { usernameRegister, passwordRegister, passwordConfirmRegistration, emailRegister } = req.body;
        
        // Initialiser bookings comme un tableau vide s'il n'est pas fourni
        let { bookings } = req.body;
        let { travels } = req.body;
        if (!Array.isArray(bookings)) {
            bookings = [];
        }
        if (!Array.isArray(travels)) {
            travels = [];
        }

        await client.connect();
        const db = client.db('users');
        const collection = db.collection("clients");
        const dbResult = await collection.find().toArray();

        let errorMessage = '';

        // Vérification des erreurs possibles
        dbResult.forEach(client => {
            if (client.usernameRegister === usernameRegister) {
                errorMessage = 'This Username is already taken';
            } else if (client.emailRegister === emailRegister) {
                errorMessage = 'This Email is already taken';
            } else if (passwordRegister !== passwordConfirmRegistration) {
                errorMessage = 'The passwords do not match';
            }
        });

        if (errorMessage) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(errorMessage);
            res.end();
        } else {
            // Sauvegarder l'utilisateur dans la base de données avec bookings initialisé comme un tableau vide
            const newUser = {
                usernameRegister,
                passwordRegister,
                emailRegister, 
                bookings, 
                travels
            };
            await collection.insertOne(newUser);
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('You are successfully registered');
            res.end();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});


let userActif = ''; 
let userActifId = '';  
let voyagePublies; 
let voageEffectue; 
let voyageannonce; 
let logginSucess = '';
let logginInvalid = ''; 

// authification de l'utilisateur avant toute connexion
app.post('/login', async(req, res)=>{
    
    try{
        const{emailInputLogin, passwordInputLogin} = req.body; 
        await client.connect(); 
        const db = client.db('users');  
        const currentDate = new Date().toISOString().slice(0, 16);

        // Compter les voyages dont la date de départ est postérieure ou égale à la date actuelle
        let totalVoyageAnnonce = await db.collection("register").countDocuments({
        dateAndTineDeparture: { $gte: currentDate }
        });

        let voyageAnnonce = await db.collection("register").countDocuments(); 
        const collectionClients = db.collection("clients"); 
        const  dbResult = await collectionClients.find().toArray();
        
          
        dbResult.forEach(userLogIn =>{
        if(userLogIn.emailRegister === emailInputLogin && userLogIn.passwordRegister ===  passwordInputLogin) {  

            userActif = userLogIn.usernameRegister; 
            userActifId = userLogIn._id;
            voyagePublies = userLogIn.travels.length; 
            voageEffectue =  userLogIn.bookings.length; 
            voyageannonce = totalVoyageAnnonce;  
            

            if (userLogIn.travels && userLogIn.travels.length > 0){
                    logginSucess= ` <div class="Bienvenu">
                
                    <h2>Salut ${userActif}, ravis de te revoir parmi nous </h2></div>

                    <nav class="navbarLink">
                        <div class="covoiturageAnnoncé">
                        <div class="covoiturageAnnoncéTitre">Voyage annoncé</div>
                        <div class="covoiturageAnnoncéNbr">${voyagePublies}</div>
                        </div>
                        <div class="covoiturageReserve">
                        <div class="covoiturageReserveTitre">Voyage Reservé</div>
                        <div class="covoiturageReserveNbr">${ voageEffectue}</div>
                        </div>
                        <div class="covoiturageFait">
                        <div class="covoiturageFaitTitre">Voyage Effectué </div>
                        <div class="totalCovoiturageAnnoncé">${voyageannonce}</div>
                        </div>
                    </nav>
            
                    <div class="travelbooking">
                            <li><a href="#" class="announceAtrip">Announce a Trip</a></li>
                            <li><a href="#" class="FindAtrip">Find a Trip</a></li>
                    </div>

                    <div class="announceTravelForm">
                    <h2 class="annonceVoyageTitre"> Provide more details on your trip</h2>
                    <form action="/submit" method="post">
                        <label for="username">Username</label>
                        <input id="username" name="username" type="text"><br><br>
                        <label for="departureRegion">Region of Departure</label>
                        <select id="departureRegion" name="departureRegion" required>
                            <option value="ChooseRegion">Choose region of departure</option>
                            <option value="Adamaoua">Adamaoua</option>
                            <option value="Centre">Centre</option>
                            <option value="Est">Est</option>
                            <option value="Extrême-Nord">Extrême-Nord </option>
                            <option value="Littoral">Littoral </option>
                            <option value=" Nord"> Nord</option>
                            <option value="Nord-Ouest">Nord-Ouest</option>
                            <option value="Ouest">Ouest</option>
                            <option value="Sud">Sud </option>
                            <option value="Sud-ouest">Sud-ouest</option>
                        </select>
                    <br><br>
                    <label for="departureTown">Departure city/town</label>
                    <input type="text" id="departureTown" name="departureTown" required ><br><br>

                    <label for="arrivalRegion">Region of Arrival</label>
                    <select id="arrivalRegion" name="arrivalRegion" required>
                        <option value="ChooseRegion">Choose region of arrival</option>
                        <option value="Adamaoua">Adamaoua</option>
                        <option value="Centre">Centre</option>
                        <option value="Est">Est</option>
                        <option value="Extrême-Nord">Extrême-Nord </option>
                        <option value="Littoral">Littoral </option>
                        <option value=" Nord"> Nord</option>
                        <option value="Nord-Ouest">Nord-Ouest</option>
                        <option value="Ouest">Ouest</option>
                        <option value="Sud">Sud </option>
                        <option value="Sud-ouest">Sud-ouest</option>
                    </select>
                    <br><br>

                    <label for="arrivalTown">Arrival city/town</label>
                    <input type="text" id="arrivalTown" name="arrivalTown" required><br><br>
                    <label for="meet">Meet point</label>
                    <input type="text" id="meet" name="meet" required ><br><br>
                    <label for="dateAndTineDeparture">Date and hour of departure</label>
                    <input type="datetime-local" id="dateAndTineDeparture" name="dateAndTineDeparture" required><br><br>
                    <label for="drop-offPoint">Drop-off point</label>
                    <input type="name" id="drop-offPoint" name="dropoffPoint" required ><br><br>
                    <label for="seats">Available seats</label>
                    <input type="number" id="seats" name="seats" required><br><br>
                    <label for="price">Contribution in FCFA</label>
                    <input type="number" id="price" name="price" required><br><br>
                    <label for="paiementMode">paiement Mode</label>
                    <select id="paiementMode" name="paiementMode" required>
                        <option value="">Choose et paiement Mode</option>
                        <option value="cash">Cash</option>
                        <option value="Orange Money">Orange Money</option>
                        <option value="momo">Mobile Money</option>
                        <option value="card">Visa/Master Card</option>
                        <option value="paypal">Paypal</option>
                    </select>
                <br><br>
                <label for="driverLicenceNbr">Driver licence number</label>
                <input id="driverLicenceNbr" type="number" name="driverLicenceNbr" minlength="12" maxlength="12"><br><br>
                <label for="expireDate">Expire date</label>
                <input type="date" id="expireDate" name="expireDate"><br><br>
                <label for="issuePlace">Place of Issue</label>
                <input type="name" id="issuePlace" name="issuePlace"><br><br>
                <label for="Carimmatriculation">Car's immatriculation</label>
                <input type="name" id="Carimmatriculation" name="Carimmatriculation"><br><br>
                <label for="CarModel">Car's Model</label>
                <input type="name" id="CarModel" name="CarModel"><br><br>
                <label for="CarColor">Car's color</label>
                <input type="string" id="CarColor" name="CarColor"><br><br>
                <input type="submit" value="submit">
                <input type="reset" value="reset">

            </form>
            
            </div>

                       

            <div class="FindTraveilForm">
                <h2 class="rechercheYoyageTitre"> Find a Travel</h2>
            <form action="/findTravel" method="post">
                <label  for="departureRegionARR">Region of Departure</label>
                <select id="departureRegionARR" name="departureRegionARR" required>
                    <option value="ChooseRegion">Choose region of departure</option>
                    <option value="Adamaoua">Adamaoua</option>
                    <option value="Centre">Centre</option>
                    <option value="Est">Est</option>
                    <option value="Extrême-Nord">Extrême-Nord </option>
                    <option value="Littoral">Littoral </option>
                    <option value=" Nord"> Nord</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Ouest">Ouest</option>
                    <option value="Sud">Sud </option>
                    <option value="Sud-ouest">Sud-ouest</option>
                </select>
                <br><br>
                <label for="departureTownARR">Departure city/town</label>
                <input type="text" id="departureTownARR" name="departureTownARR" required ><br><br>

                <label for="arrivalRegionARR">Region of Arrival</label>
                <select id="arrivalRegionARR" name="arrivalRegionARR" required>
                    <option value="ChooseRegion">Choose region of arrival</option>
                    <option value="Adamaoua">Adamaoua</option>
                    <option value="Centre">Centre</option>
                    <option value="Est">Est</option>
                    <option value="Extrême-Nord">Extrême-Nord </option>
                    <option value="Littoral">Littoral </option>
                    <option value=" Nord"> Nord</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Ouest">Ouest</option>
                    <option value="Sud">Sud </option>
                    <option value="Sud-ouest">Sud-ouest</option>
                </select>
                <br><br>

                <label for="arrivalTownARR">Arrival city/town</label>
                <input type="text" id="arrivaPlTownARR" name="arrivalTownARR" required><br><br>
                
                <label for="dateAndTineDepartureARR">Date and hour of departure</label>
                <input type="datetime-local" id="dateAndTineDepartureARR" name="dateAndTineDepartureARR" required><br><br>

                <input type="submit" value="submit">
                <input type="reset" value="reset">
            </form>
            </div>


               <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
                <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
                `
               
               logginSucess += `
               <div class="listeDesVoyagesContainer">
                   ${userLogIn.travels.map((travel, index) => `
                       <div class="resultListVaoyagePublies">
                           
                          <div class="resultTimeDatePublie">
                                  <p>Départ le</p>
                                    <p>${travel.dateAndTineDeparture.split('T')[0]}</p>
                                  <p>à</p>
                                  <p>${travel.dateAndTineDeparture.split('T')[1]}</p>
                            </div>
                           <div class="resultDepartureRegion">
                               <p>${travel.departureRegion}, ${travel.departureTown}</p>
                               <p>${travel.meet}</p>
                               <br>
                               <br>
                               <p>${travel.arrivalRegion}, ${travel.arrivalTown}</p>
                               <p>${travel.dropoffPoint}</p>
                           </div>
                           <div class="PriceAndPlacesResult">
                               <p>${travel.price} FCFA</p>
                               <p>${travel.seats} seats available</p>
                           </div>
                           
                       </div>
                   `).join('')}
               </div>
            </div>`;
           

    }

    if (userLogIn.bookings && userLogIn.bookings.length > 0) {
        logginSucess += `
            <div class="listeDesVoyagesBooker">
                ${userLogIn.bookings.map((booking, index) => {
                    // Calculer le temps restant avant le départ
                    const now = new Date();
                    const departureDateTime = new Date(booking.dateAndTineDeparture);
                    const timeDifference = departureDateTime - now;
                    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convertir en heures
    
                    // Vérifier si le voyage est dans moins de 24 heures
                    const canModifyOrCancel = hoursDifference > 24;
    
                    return `
                         <div>
                                <div class="resultListVaoyageBooker">
                                    <div>
                                        <div class="resultTimeDatePublie">
                                            <p>Départ le</p>
                                            <p>${booking.dateAndTineDeparture.split('T')[0]}</p>
                                            <p>à</p>
                                            <p>${booking.dateAndTineDeparture.split('T')[1]}</p>
                                        </div>
                                        <br><br>
                                        <div class="resultTimeDate">
                                            <p>Réservé le</p>
                                            <p>${new Date(booking.bookingDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="resultDepartureRegion">
                                        <p>${booking.departureRegion}, ${booking.departureCity}</p>
                                        <p>${booking.meet}</p>
                                        <br><br>
                                        <p>${booking.arrivalRegion}, ${booking.arrivalCity}</p>
                                        <p>${booking.dropOffPoint}</p>
                                    </div>
                                    <div class="PriceAndPlacesResult">
                                        <p>${booking.price} FCFA</p>
                                        <p>${booking.seatNumber} place(s) réservée(s)</p>
                                    </div>
            
                                    
                                </div>

                                <div class="actionButtons">
                                        <button class="deleteButton" data-booking-id="${booking._id}">Supprimer</button>
                                        ${canModifyOrCancel ? `
                                            <button class="modifyButton" data-booking-id="${booking._id}">Modifier</button>
                                            <button class="cancelButton" data-booking-id="${booking._id}">Annuler</button>
                                        ` : `
                                            <p style="color:red;">Modification</p>
                                            <p  style="color:red;">Annulation</p>
                                            <p style="color:red;">impossible à moins de 24h</p>
                                        `}
                                    </div>
                            </div>
                    `;
                }).join('')}
            </div>
        `;
    }
        
               
}else if (userLogIn.emailRegister !== emailInputLogin || userLogIn.passwordRegister !==  passwordInputLogin){
                logginInvalid = `
              
                <body>
                    <div class="loginPageFail">
                        <h2 >Invalid login credential! please try again<h2>
                        <h2>Login</h2>
                        <form class="loginForm" action="/login" method="post">
                            <input type="email" class="emailInput" name="emailInputLogin" placeholder="Enter your email adress" required>
                            <input type="password" class="passwordinput" name="passwordInputLogin" placeholder="Enter your password" required>
                            <button type="submit" value="Login" class="loginButton">Login</button>
                            <p>Are you a Cheetah's Travellers Member?<a href="#" class="registerRedirection">Register</a></p>
                        </form>
                    </div>
                </body>`; 
             }
        })
            if(logginSucess){
                fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                    res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
                    res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
                    res.write(data);
                    res.write(logginSucess);
                    res.end();
                 }); 
            

            }else if(logginInvalid){
                fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                    res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
                    res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
                    res.write(data);
                    res.write(logginInvalid);
                    res.end();
                });
            }
        
    }catch(error){

        console.error(error); 

    }finally{
        
        await client.close();

    }
})


// Enregistrer et publier un voyage 

let dbResult= ''; 

app.post('/submit', async(req, res) => {
    try {
        const {
            departureRegion, departureTown, arrivalRegion, arrivalTown, meet, dateAndTineDeparture,
            dropoffPoint, seats, price, paiementMode, driverLicenceNbr, expireDate, issuePlace, Carimmatriculation, 
            CarModel, CarColor, username
        } = req.body; 

        await client.connect(); 
        const db = client.db('users'); 
        const collection = db.collection("register"); 
        const collectionClients = db.collection("clients"); 
        dbResult = await collectionClients.find().toArray();

        // Vérifier si l'utilisateur est membre
        const clientFound = dbResult.find(client => client.usernameRegister === username);

        if (!clientFound) {
            // Si l'utilisateur n'est pas trouvé, envoyer une réponse et sortir
            return res.send("To announce a travel, you have to be a member, please register or log in");
        }

        const newTravel = {
            departureRegion, departureTown, arrivalRegion, arrivalTown, meet, dateAndTineDeparture,
            dropoffPoint, seats, price, paiementMode, driverLicenceNbr, expireDate, issuePlace, Carimmatriculation,
            CarModel, CarColor, announcerId: clientFound._id
        };

        await collectionClients.updateOne(
            { usernameRegister: username },
            { $push: { travels: newTravel } } // ou `travels` à la place de `bookings` si vous préférez un autre nom de champ
        );

        // Si l'utilisateur est trouvé, insérer les données du voyage
        const result = await collection.insertOne({
            departureRegion, departureTown, arrivalRegion, arrivalTown, meet, dateAndTineDeparture,
            dropoffPoint, seats, price, paiementMode, driverLicenceNbr, expireDate, issuePlace, Carimmatriculation, 
            CarModel, CarColor, announcerId: clientFound._id
        });

        if(result){
          
             // Envoi de l'email de confirmation avec Nodemailer
             const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rutehondiang@gmail.com', // Remplacez par votre adresse email
                    pass: 'bsbp zdnb cjtj oepj' // Utilisez un mot de passe d'application si nécessaire
                }
            });


            const mailOptionsToclientFound = {
                from: 'rutehondiang@gmail.com',
                to:  clientFound.emailRegister, // Email de l'utilisateur
                subject: 'Réservation Enregistrée',
                text: `
                Bonjour ${clientFound.usernameRegister},

                Votre votre voyage a été enregistré et publié avec succès. Voici les détails de votre voyage :

                - Ville de départ : ${departureTown} (${departureRegion})
                - Lieu de rencontre : ${meet}
                - Ville d'arrivée : ${arrivalTown} (${arrivalRegion})
                - Lieu de dépôt : ${dropoffPoint}
                - Contribution par place : ${price}FCFA
                - Mode de paiement : ${paiementMode}
                - Plaque d'immatriculation : ${Carimmatriculation}
                - Modèle de la voiture : ${CarModel}
                - Couleur de la voiture : ${CarColor}
                - Date et heure de départ : ${dateAndTineDeparture}

                Merci d'avoir choisi Top départ. Nous vous souhaitons un agréable voyage.

                Cordialement,
                L'équipe de gestion des voyages
                `
            };

            transporter.sendMail(mailOptionsToclientFound, (error, info) => {
                if (error) {
                    return console.log('Erreur lors de l\'envoi de l\'email:', error);
                }
                console.log('Email envoyé : ' + info.response);
            });
           
            };

        // Envoyer une réponse réussie
        fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
            res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
            res.write(data);
            res.write(logginSucess);
            res.write(`<p>Your travel from ${departureRegion} to ${arrivalRegion} with ${dropoffPoint} as end point, with a contribution of ${price} for each passenger, is registered and published.</p>`);
            res.end();
        });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});

    let findTravel = `<div class="FindTraveilForm"  style="display: block">
                <h2 class="rechercheYoyageTitre"> Find a Travel</h2>
            <form action="/findTravel" method="post">
                <label  for="departureRegionARR">Region of Departure</label>
                <select id="departureRegionARR" name="departureRegionARR" required>
                    <option value="ChooseRegion">Choose region of departure</option>
                    <option value="Adamaoua">Adamaoua</option>
                    <option value="Centre">Centre</option>
                    <option value="Est">Est</option>
                    <option value="Extrême-Nord">Extrême-Nord </option>
                    <option value="Littoral">Littoral </option>
                    <option value=" Nord"> Nord</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Ouest">Ouest</option>
                    <option value="Sud">Sud </option>
                    <option value="Sud-ouest">Sud-ouest</option>
                </select>
                <br><br>
                <label for="departureTownARR">Departure city/town</label>
                <input type="text" id="departureTownARR" name="departureTownARR" required ><br><br>

                <label for="arrivalRegionARR">Region of Arrival</label>
                <select id="arrivalRegionARR" name="arrivalRegionARR" required>
                    <option value="ChooseRegion">Choose region of arrival</option>
                    <option value="Adamaoua">Adamaoua</option>
                    <option value="Centre">Centre</option>
                    <option value="Est">Est</option>
                    <option value="Extrême-Nord">Extrême-Nord </option>
                    <option value="Littoral">Littoral </option>
                    <option value=" Nord"> Nord</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Ouest">Ouest</option>
                    <option value="Sud">Sud </option>
                    <option value="Sud-ouest">Sud-ouest</option>
                </select>
                <br><br>

                <label for="arrivalTownARR">Arrival city/town</label>
                <input type="text" id="arrivaPlTownARR" name="arrivalTownARR" required><br><br>
                
                <label for="dateAndTineDepartureARR">Date and hour of departure</label>
                <input type="datetime-local" id="dateAndTineDepartureARR" name="dateAndTineDepartureARR" required><br><br>

                <input type="submit" value="submit">
                <input type="reset" value="reset">
            </form>
            </div>


               <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
                <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>`

    app.post('/findTravel', async(req, res)=>{
      try{
       const {departureRegionARR, departureTownARR, arrivalRegionARR, arrivalTownARR, dateAndTineDepartureARR }=req.body; 
       await client.connect(); 
       const db = client.db('users'); 
       const collection = db.collection('register'); 
       const dbResult = await collection.find().toArray();
   
       let travelsFound = []; 
       let displayResult = ''; 
       const findDate = new Date(dateAndTineDepartureARR); 
       const dateFinding = formatDate(findDate);

       
       dbResult.forEach(travel => {
        const departureDateTimezone = new Date(travel.dateAndTineDeparture);
        const date = formatDate(departureDateTimezone);
        if (travel.departureTown === departureTownARR && travel.arrivalTown === arrivalTownARR && date === dateFinding) {
            travelsFound.push(travel);
        }
    });

        if (travelsFound.length > 0) {

             fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
                 if (err) throw err;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                    res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
                    res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
                    res.write(data);
            

                res.write(`<h2 class="resultTitle">Travel available ${dateFinding} </h2> 
                <br><br> ` );
                travelsFound.forEach(travel => {
                    const departureDateTime = new Date(travel.dateAndTineDeparture);
                    const departureTime = formatTime(departureDateTime.getHours()) + ':' + formatTime(departureDateTime.getMinutes());
                    
                    displayResult += `
                        
                            <div class="result">
                                <div class="resultTimeDate">
                                    <p>${departureTime}</p>
                                </div>
                                <div class="resultDepartureRegion">
                                    <p>${travel.departureTown}</p>
                                    <p>${travel.meet}</p>
                                    <br>
                                    <br>
                                    <p>${travel.arrivalTown}</p>
                                    <p>${travel.dropoffPoint}</p>
                                </div>
                                <div class="PriceAndPlacesResult">
                                    <p>${travel.price} FCFA</p>
                                    <p>${travel.seats} seats available</p>
                                </div>
                                <a class="voirDetail" href="/travelDetails?id=${travel._id}">Voir les détails</a>
                            </div>
                    `; 
            });
            
           res.write(`<div class="resultContainer">${displayResult}</div>`); 
           return res.end(); 
        });

          
      }else if (travelsFound.length === 0){

        fs.readFile(path.join(__dirname, 'annonceVoyage.htm'), function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                    res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
                    res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
                    res.write('<script src="annonceVoyage.js" defer></script>'); 
                    res.write(data);
                   
                    res.write(`<nav class="navbarLink">
                        <div class="covoiturageAnnoncé">
                        <div class="covoiturageAnnoncéTitre">Voyage annoncé</div>
                        <div class="covoiturageAnnoncéNbr">${voyagePublies}</div>
                        </div>
                        <div class="covoiturageReserve">
                        <div class="covoiturageReserveTitre">Voyage Reservé</div>
                        <div class="covoiturageReserveNbr">${voageEffectue}</div>
                        </div>
                        <div class="covoiturageFait">
                        <div class="covoiturageFaitTitre">Voyage Effectué </div>
                        <div class="covoiturageAnnoncé">${voyageannonce}</div>
                        </div>
                    </nav>`)
                    res.write(` <div class="travelbooking">
                                    <li><a href="#" class="announceAtrip">Announce a Trip</a></li>
                                    <li><a href="#" class="FindAtrip">Find a Trip</a></li>
                                </div>`)
                    res.write(`<h2 class="aucunVoyageTrouver" style="text-align: center">Sorry there is no travel available now</h1>`); 
                    res.write(`${findTravel}`); 
                    res.write(`<div class="announceTravelForm" style="display, none">
                    <h2 class="annonceVoyageTitre"> Provide more details on your trip</h2>
                    <form action="/submit" method="post">
                        <label for="username">Username</label>
                        <input id="username" name="username" type="text"><br><br>
                        <label for="departureRegion">Region of Departure</label>
                        <select id="departureRegion" name="departureRegion" required>
                            <option value="ChooseRegion">Choose region of departure</option>
                            <option value="Adamaoua">Adamaoua</option>
                            <option value="Centre">Centre</option>
                            <option value="Est">Est</option>
                            <option value="Extrême-Nord">Extrême-Nord </option>
                            <option value="Littoral">Littoral </option>
                            <option value=" Nord"> Nord</option>
                            <option value="Nord-Ouest">Nord-Ouest</option>
                            <option value="Ouest">Ouest</option>
                            <option value="Sud">Sud </option>
                            <option value="Sud-ouest">Sud-ouest</option>
                        </select>
                    <br><br>
                    <label for="departureTown">Departure city/town</label>
                    <input type="text" id="departureTown" name="departureTown" required ><br><br>

                    <label for="arrivalRegion">Region of Arrival</label>
                    <select id="arrivalRegion" name="arrivalRegion" required>
                        <option value="ChooseRegion">Choose region of arrival</option>
                        <option value="Adamaoua">Adamaoua</option>
                        <option value="Centre">Centre</option>
                        <option value="Est">Est</option>
                        <option value="Extrême-Nord">Extrême-Nord </option>
                        <option value="Littoral">Littoral </option>
                        <option value=" Nord"> Nord</option>
                        <option value="Nord-Ouest">Nord-Ouest</option>
                        <option value="Ouest">Ouest</option>
                        <option value="Sud">Sud </option>
                        <option value="Sud-ouest">Sud-ouest</option>
                    </select>
                    <br><br>

                    <label for="arrivalTown">Arrival city/town</label>
                    <input type="text" id="arrivalTown" name="arrivalTown" required><br><br>
                    <label for="meet">Meet point</label>
                    <input type="text" id="meet" name="meet" required ><br><br>
                    <label for="dateAndTineDeparture">Date and hour of departure</label>
                    <input type="datetime-local" id="dateAndTineDeparture" name="dateAndTineDeparture" required><br><br>
                    <label for="drop-offPoint">Drop-off point</label>
                    <input type="name" id="drop-offPoint" name="dropoffPoint" required ><br><br>
                    <label for="seats">Available seats</label>
                    <input type="number" id="seats" name="seats" required><br><br>
                    <label for="price">Contribution in FCFA</label>
                    <input type="number" id="price" name="price" required><br><br>
                    <label for="paiementMode">paiement Mode</label>
                    <select id="paiementMode" name="paiementMode" required>
                        <option value="">Choose et paiement Mode</option>
                        <option value="cash">Cash</option>
                        <option value="Orange Money">Orange Money</option>
                        <option value="momo">Mobile Money</option>
                        <option value="card">Visa/Master Card</option>
                        <option value="paypal">Paypal</option>
                    </select>
                <br><br>
                <label for="driverLicenceNbr">Driver licence number</label>
                <input id="driverLicenceNbr" type="number" name="driverLicenceNbr" minlength="12" maxlength="12"><br><br>
                <label for="expireDate">Expire date</label>
                <input type="date" id="expireDate" name="expireDate"><br><br>
                <label for="issuePlace">Place of Issue</label>
                <input type="name" id="issuePlace" name="issuePlace"><br><br>
                <label for="Carimmatriculation">Car's immatriculation</label>
                <input type="name" id="Carimmatriculation" name="Carimmatriculation"><br><br>
                <label for="CarModel">Car's Model</label>
                <input type="name" id="CarModel" name="CarModel"><br><br>
                <label for="CarColor">Car's color</label>
                <input type="string" id="CarColor" name="CarColor"><br><br>
                <input type="submit" value="submit">
                <input type="reset" value="reset">

            </form>
            
            </div>`);

            return res.end();
                     
                });    
       
      }

    
      
   }catch(error){
       console.error(error); 
       }finally{
           await client.close(); 
       }
   });

    
  app.listen(port, ()=>{
      console.log(`server lauched on localhost:${port}`); 
  })
    

  function formatTime(time) {
    return time < 10 ? '0' + time : time;
}; 


function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); 
  const day = ('0' + date.getDate()).slice(-2); 
  return `${year}-${month}-${day}`;
}
let id; 
app.get('/travelDetails', async(req, res) => {
    try {
        const travelId = req.query.id; // Récupérons l'identifiant du voyage à partir de la requête
        await client.connect();
        const db = client.db('users');
        const collection = db.collection('register');
        const travel = await collection.findOne({ _id: new ObjectId(travelId) }); // Utilisons l'identifiant pour trouver le voyage
        console.log(travelId); 
        //id = travel._id; 
        if (travel) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.write(`<link rel="stylesheet" type="text/css" href="style.css">`);
            res.write(' <script src="annonceVoyage.js" defer></script>');
            res.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'); 
            res.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>'); 
            res.write(`
            <body>
           
                        <div class="resultDetails">
                            <div class="departureDetails">
                                <h2><b>Departure</b></h2>
                                <div>
                                    <h3>${travel.dateAndTineDeparture} From ${travel.departureTown}</h3>
                                    <p>${travel.meet}</p>
                                </div>
                                
                            </div>
                            <div class="arrivalDetails">
                                <h2><b>Arrival</b></h2>
                                <div>
                                    <h3>${travel.arrivalTown}</h3>
                                    <p>${travel.dropoffPoint}</p>
                                </div>
                                
                            </div>
                            <div class="PriceAndPlacesResult">
                                    <h2><b>Payment mode</b></h2>
                                    <div>
                                        <h3>Cash payment</h3>
                                        <p>${travel.price} FCFA</p>
                                    </div>
                                    
                            </div>
                            <div class="carDetail">
                                <h2><b>car Model</b></h2>
                                <h3>${travel.CarModel}</h3>
                            </div>
                            <div class="licenceDetail">
                                <h2><b>Driver's Licence </b></h2>
                                <h3> ${travel.driverLicenceNbr} (VALID)</h3>
                            </div>
                            <div class="SeatDetail">
                                <h2><b>Seats available</b></h2>
                                <h3> ${travel.seats}</h3>
                            </div>
                            <form class="bookingForm" action="/booking" method="get">
                            <input type="hidden" name="id" value="${travel._id}"> <!-- Assurez-vous que travelIdID est correctement remplacé -->
                            
                            <div class="booking">
                                <h2><b>Make your reservation</b></h2>
                                <label for="usernameReservation">Enter your username</label>
                                <input type="text" name="usernameReservation" value="${userActif}" id="usernameReservation" required>
                                
                                <label for="SeatNumber">Choose the number of seats</label>
                                <input type="number" id="SeatNumber" name="seatNumber" min="1" max="<%= travelSeats %>" required><br>
                                
                                <input type="submit" value="Book Now">
                            </div>
                        </form>




                        </div>

                            <div id="popup" class="popup">
                                <div class="popup-content">
                                    <span class="close">&times;</span>
                                    <h2>Payment mode</h2>
                                    <p>La contribution à remettre au conducteur<br>
                                    s'élève à ${travel.price} fcfa par place. Cette somme doit être remise<br>
                                    au conducteur dans la voiture. <br>
                                    Il se peut que votre conducteur ne possède pas de monnaie. <br>
                                    Pour éviter tout désagrément, prévoyez un montant net. </p>
                                </div>
                            </div>

                            <div id="popupBooking" class="popupBooking">
                                <div class="popup-contentBooking">
                                    <span class="closeBooking">&times;</span>
                                    <h2>Frais de réservation</h2>
                                    <p>les frais de réservation s'élève à 500 fcfa<br>
                                    Après votre réservation vous aurez accès à: <br><br>
                                    - l'identité du conducteur et ses contact<br>
                                    - la marque, l'immatriculation et la couleur de la voiture<br>><br>
                                    Le conducteur aura également accès à votre identité et vos coordonnées<br>
                                    
                                </div>
                            </div>
            </body>
                    
            `);
            res.end();
        } else {
            res.status(404).send('Voyage non trouvé');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }

    console.log(userActif); 
    console.log(userActifId); 
});


// Ajoutez un endpoint pour gérer la réservation
app.get('/booking', async (req, res) => {
    try {
        // Vérifiez les paramètres de requête
        console.log('Query Parameters:', req.query);

        const travelIdID = req.query.id; // Récupérez l'identifiant du voyage
        const seatNumberString = req.query.seatNumber; // Récupérez le nombre de places
        const userId = userActifId; // Récupérez l'ID de l'utilisateur qui réserve
        let bookings = ''; 
        
        console.log('Travel ID:', travelIdID);
        console.log('Seat Number String:', seatNumberString);
        console.log('User ID:', userId);
        
        // Vérifiez que l'ID du voyage est une chaîne valide de 24 caractères
        if (!ObjectId.isValid(travelIdID)) {
            console.error('ID de voyage invalide:', travelIdID);
            return res.status(400).send('ID de voyage invalide.');
        }

        // Vérifiez que l'ID de l'utilisateur est valide
        if (!ObjectId.isValid(userId)) {
            console.error('ID d\'utilisateur invalide:', userId);
            return res.status(400).send('ID d\'utilisateur invalide.');
        }

        const seatNumber = Number(seatNumberString);

        if (isNaN(seatNumber) || seatNumber <= 0) {
            console.error('Nombre de sièges invalide:', seatNumberString);
            return res.status(400).send('Nombre de sièges invalide.');
        }

        // Connexion à la base de données MongoDB
        await client.connect();
        const db = client.db('users');
        const collection = db.collection('register');
        const userCollection = db.collection('clients'); 

        // Récupérez le voyage correspondant à la réservation
        const travel = await collection.findOne({ _id: new ObjectId(travelIdID) });
        const userTravel = await userCollection.findOne({ _id: new ObjectId(userId) });

        if (!travel) {
            return res.status(404).send('Voyage non trouvé');
        }

        if (!userTravel) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        // Vérifiez s'il y a suffisamment de places disponibles
        const seatsAvailable = Number(travel.seats);
        if (seatsAvailable >= seatNumber) {
            // Soustrayez le nombre de places réservées de la valeur totale des sièges
            const updatedSeats = seatsAvailable - seatNumber;

            // Mettez à jour le nombre de sièges disponibles dans la base de données
            await collection.updateOne({ _id: new ObjectId(travelIdID) }, { $set: { seats: updatedSeats } });

            // Ajoutez la réservation dans le profil de l'utilisateur
            const booking = {
                travelId: travelIdID,
                dateAndTineDeparture: travel.dateAndTineDeparture,
                departureRegion: travel.departureRegion, 
                departureCity: travel.departureTown,
                arrivalRegion: travel.arrivalRegion, 
                arrivalCity: travel.arrivalTown,
                dropOffPoint: travel.dropoffPoint,
                price: travel.price, 
                meet: travel.meet, 
                seatNumber: seatNumber,
                bookingDate: new Date()
            };

            await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { bookings: booking } } // Ajoute la réservation dans le tableau 'bookings' de l'utilisateur
            );

            bookings = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: { _id: 0, usernameRegister: 0, passwordRegister: 0, emailRegister: 0}} );
            let bookingsLength  = bookings.bookings.length; 
             console.log(bookingsLength); 


            let userAnnounceredId =  travel.announcerId;
            let announceur = await userCollection.findOne({ _id: new ObjectId(userAnnounceredId)})

            // Envoi de l'email de confirmation avec Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rutehondiang@gmail.com', // Remplacez par votre adresse email
                    pass: 'bsbp zdnb cjtj oepj' // Utilisez un mot de passe d'application si nécessaire
                }
            });

            console.log(dbResult); 

            const mailOptionsToclientFound = {
                from: 'rutehondiang@gmail.com',
                to:  announceur.emailRegister, // Email de l'utilisateur
                subject: 'Réservation Enregistrée',
                text: `
                Bonjour ${announceur.usernameRegister},

                ${userTravel.usernameRegister} Viens d'effectuer une réservation de ${seatNumber} de places. 
                    son mode de paiement est ${travel.paiementMode}. Vous pouvez le contactez par mail au 
                    ${userTravel.emailRegister} ou par téléphone au ${userTravel.phoneNumber}.
                    Il vous reste ${travel.seats} à combler. 

                Merci d'avoir choisi Top départ. Nous vous souhaitons un agréable voyage.

                Cordialement,
                L'équipe de gestion des voyages
                `
            };

            transporter.sendMail(mailOptionsToclientFound, (error, info) => {
                if (error) {
                    return console.log('Erreur lors de l\'envoi de l\'email:', error);
                }
                console.log('Email envoyé : ' + info.response);
            });



            const mailOptions = {
                from: 'rutehondiang@gmail.com',
                to: userTravel.emailRegister, // Email de l'utilisateur
                subject: 'Confirmation de réservation',
                text: `
                Bonjour ${userTravel.usernameRegister},

                Votre réservation a été confirmée avec succès. Voici les détails de votre voyage :

                - Ville de départ : ${travel.departureTown} (${travel.departureRegion})
                - Lieu de rencontre : ${travel.meet}
                - Ville d'arrivée : ${travel.arrivalTown} (${travel.arrivalRegion})
                - Lieu de dépôt : ${travel.dropoffPoint}
                - Contribution par place : ${travel.price}FCFA
                - Mode de paiement : ${travel.paiementMode}
                - Plaque d'immatriculation : ${travel.Carimmatriculation}
                - Modèle de la voiture : ${travel.CarModel}
                - Couleur de la voiture : ${travel.CarColor}
                - Date et heure de départ : ${travel.dateAndTineDeparture}

                Merci d'avoir choisi Top départ. Nous vous souhaitons un agréable voyage.

                Cordialement,
                L'équipe de gestion des voyages
                `
            };


            // Envoyer l'email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log('Erreur lors de l\'envoi de l\'email:', error);
                }
                console.log('Email envoyé : ' + info.response);
            });


            // Réponse de succès
            return res.status(200).send(`<h1>Réservation effectuée avec succès!</h1><p>Il reste maintenant ${updatedSeats} sièges disponibles pour ce voyage.</p>`);
        } else {
            // Réponse en cas d'erreur de places insuffisantes
            return res.status(400).send('<h1>Erreur de réservation</h1><p>Désolé, il n\'y a pas suffisamment de sièges disponibles pour votre réservation.</p>');
        }
    } catch (error) {
        console.error(error);
        // En cas d'erreur, renvoyez une réponse d'erreur au client
        return res.status(500).send('Une erreur s\'est produite lors du traitement de votre réservation.');
    } finally {
        await client.close();
    }

   
});









