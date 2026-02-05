<template>
  <div class="container-fluid d-flex justify-content-center align-items-center min-vh-100 patient-home">
    <div class="card shadow-lg p-4 rounded-4 patient-card">
      <!-- Logo du patient -->
      <div class="text-center mb-4">
        <img
          src="@/assets/logo-patient.png"
          alt="Logo patient"
          class="patient-logo"
        />
        <h2 class="fw-bold text-primary-emphasis mt-3">
          👤 Bienvenue {{ userData.prenom || '' }} {{ userData.nom || '' }}
        </h2>
      </div>

      <!-- Fonctionnalités -->
      <div class="features text-center">
        <h4 class="text-secondary mb-4">Mes fonctionnalités</h4>
        <div class="d-grid gap-3">
          <router-link class="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2" to="/prendre-rendez-vous">
            <i class="fas fa-calendar-plus"></i> Prendre un rendez-vous
          </router-link>
          <router-link class="btn btn-outline-success btn-lg d-flex align-items-center justify-content-center gap-2" to="/my-medical-history">
            <i class="fas fa-file-medical"></i> Consulter mes ordonnances
          </router-link>
          <router-link class="btn btn-outline-info btn-lg d-flex align-items-center justify-content-center gap-2" to="/mes-rendezvous">
            <i class="fas fa-calendar-check"></i> Consulter mes rendez-vous
          </router-link>
        </div>
      </div>

      <!-- Bouton de déconnexion -->
      <button class="btn btn-danger btn-lg mt-4 w-100" @click="logout">
        <i class="fas fa-sign-out-alt me-2"></i>Se déconnecter
      </button>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: 'PatientHome',
  data() {
    return {
      userData: {},
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.userData = userDoc.data();
        } else {
          alert('Aucun utilisateur trouvé.');
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        alert('Erreur lors de la récupération des données.');
      }
    } else {
      alert('Veuillez vous connecter.');
      this.$router.push({ name: 'login' });
    }
  },
  methods: {
    logout() {
      signOut(auth)
        .then(() => this.$router.push({ name: 'login' }))
        .catch((error) => {
          console.error('Erreur de déconnexion: ', error);
          alert('Une erreur est survenue lors de la déconnexion.');
        });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.patient-home {
  background: linear-gradient(to right, #d0f0f6, #e8fdfd);
  font-family: 'Poppins', sans-serif;
}

.patient-card {
  max-width: 550px;
  width: 100%;
  background-color: white;
}

.patient-logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
}
</style>