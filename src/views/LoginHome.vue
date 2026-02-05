<template>
    <div class="login-container">
      <div class="card p-4">
        <h2 class="text-center mb-3">Bienvenue</h2>
  
        <!-- Connexion -->
        <div v-if="mode === 'login'">
          <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
          <input v-model="password" type="password" placeholder="Mot de passe" class="form-control mb-2" />
          <button class="btn btn-light w-100 mb-2" @click="login">Se connecter</button>
          <div class="d-flex justify-content-between">
            <a href="#" @click.prevent="mode = 'forgot'">Mot de passe oublié ?</a>
            <a href="#" @click.prevent="mode = 'register'">Créer un compte</a>
          </div>
        </div>
  
        <!-- Inscription -->
        <div v-else-if="mode === 'register'">
          <input v-model="prenom" type="text" placeholder="Prénom" class="form-control mb-2" />
          <input v-model="nom" type="text" placeholder="Nom" class="form-control mb-2" />
          <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
          <input v-model="password" type="password" placeholder="Mot de passe" class="form-control mb-2" />
  
          <select v-model="typeUtilisateur" class="form-control mb-3">
            <option disabled value="">-- Sélectionnez un type --</option>
            <option value="patient">Patient</option>
            <option value="professionnel">Professionnel (Médecin)</option>
          </select>
  
          <button class="btn btn-light w-100 mb-2" @click="register">Créer le compte</button>
          <a href="#" @click.prevent="mode = 'login'">Déjà un compte ? Se connecter</a>
        </div>
  
        <!-- Mot de passe oublié -->
        <div v-else-if="mode === 'forgot'">
          <input v-model="email" type="email" placeholder="Entrez votre email" class="form-control mb-2" />
          <button class="btn btn-light w-100 mb-2" @click="recover">Envoyer un lien de réinitialisation</button>
          <a href="#" @click.prevent="mode = 'login'">Retour à la connexion</a>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth, db } from '@/firebase-config';  // Utilisation de `@` pour désigner le dossier `src`
   // Assure-toi que ce fichier existe bien
    
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
        prenom: '',
        nom: '',
        typeUtilisateur: '',
        mode: 'login'  // Commence sur le mode connexion
      };
    },
    methods: {
      async register() {
        try {
          console.log("Méthode register() appelée");
  
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
  
          await setDoc(doc(db, "users", user.uid), {
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            type: this.typeUtilisateur,
            uid: user.uid,
            createdAt: new Date()
          });
  
          alert("Compte créé avec succès !");
          this.mode = 'login';
        } catch (error) {
          alert("Erreur : " + error.message);
        }
      },
  
      async login() {
        if (!this.email || !this.password) {
          alert("Veuillez remplir tous les champs.");
          return;
        }
  
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
  
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
  
          if (userData && userData.type === 'patient') {
            alert("Connexion réussie !");
            this.$router.push({ name: 'PatientHome' }); // Redirige vers la page des patients
          } else if (userData && userData.type === 'professionnel') {
            alert("Connexion réussie !");
            this.$router.push({ name: 'ProfessionalHome' }); // Redirige vers la page des professionnels
          } else {
            alert("Rôle utilisateur inconnu.");
          }
        } catch (error) {
          alert("Erreur de connexion : " + error.message);
        }
      },
  
      async recover() {
        alert("Fonction de récupération à implémenter.");
      }
    }
  };
  </script>
  
  <style scoped>
  /* === FOND GÉNÉRAL === */
  .login-container {
    min-height: 100vh;
    background-image: url('/public/image/etactics-inc-g3PsF4_y7ZY-unsplash.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins', sans-serif;
  }

  /* === CARTE DE CONNEXION === */
  .card {
    background: rgba(255, 255, 255, 0.12); /* Glass effect */
    backdrop-filter: blur(15px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 40px 30px;
    width: 100%;
    max-width: 450px;
    animation: fadeInUp 0.6s ease-out;
    color: #ffffff;
  }

  /* === TITRE === */
  .card h2 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 26px;
    font-weight: 600;
    color: #ecf0f1;
  }

  /* === INPUTS === */
  input, select {
    width: 100%;
    margin-bottom: 20px;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  input::placeholder {
    color: #dcdde1;
  }

  /* === BOUTON DE CONNEXION === */
  button {
    width: 100%;
    background: linear-gradient(135deg, #2980b9, #6dd5fa);
    color: white;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  /* === LIENS DE BAS DE FORMULAIRE === */
  .links {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .links a {
    color: #ecf0f1;
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;
  }

  .links a:hover {
    text-decoration: underline;
    color: #ffffff;
  }

  /* === ANIMATION APPARITION === */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* === RESPONSIVE === */
  @media screen and (max-width: 500px) {
    .card {
      padding: 25px 20px;
    }
  }
</style>
