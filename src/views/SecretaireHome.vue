<template>
  <div class="dashboard">
    <!-- Bouton menu (3 barres) -->
    <div class="menu-toggle" @click="toggleMenu">
      ☰
    </div>

    <!-- Menu latéral -->
    <div class="side-menu" :class="{ open: isMenuOpen }">
      <ul>
        <li @click="redirectToRdvDuJour"><i class="fas fa-calendar-day"></i> Rendez-vous du jour</li>
        <li @click="redirectToDisponibilite"><i class="fas fa-clock"></i> Gérer les disponibilités</li>
        <li @click="redirectToAjouterRdv"><i class="fas fa-plus-circle"></i> Ajouter RDV sur place</li>
        <li @click="redirectToListeAttente"><i class="fas fa-list"></i> Liste d'attente</li>
        <li>
          <button @click="logout" :disabled="isLoggingOut" class="logout-button">
            <i class="fas fa-sign-out-alt"></i> Se déconnecter
          </button>
        </li>
      </ul>
    </div>

    <!-- Titre principal -->
    
  </div>
</template>

<script>
import { db, auth } from '@/firebase-config';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      isMenuOpen: false,
      isLoggingOut: false
    };
  },
  methods: {
    redirectToListeAttente() {
      this.$router.push({ name: 'ListeAttente' });
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    redirectToRdvDuJour() {
      this.$router.push({ name: 'RendezVousDuJour' });
    },
    redirectToDisponibilite() {
      this.$router.push({ name: 'DisponibiliteForm' });
    },
    redirectToAjouterRdv() {
      this.$router.push({ name: 'AjouterRdvSurPlace' });
    },
    async logout() {
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const secretaireRef = doc(db, 'secretaires', user.uid);
          await updateDoc(secretaireRef, { isOnline: false });
          await signOut(auth);
        }
        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        alert("Erreur lors de la déconnexion, veuillez réessayer.");
      } finally {
        this.isLoggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.dashboard {
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  background-image: url('@/assets/02F127E0-E085-49CE-ADF4-B4CA336D0A40.jpeg'); /* ton image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(3px); /* effet doux */
  position: relative;
  overflow-x: hidden;
}

/* === ÉLÉMENTS DÉCORATIFS CERCLE BLEU FLUO === */
.dashboard::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #d0e8f2 20%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* === BOUTON MENU (3 BARRES) === */
.menu-toggle {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 28px;
  cursor: pointer;
  color: #ffffff;
  z-index: 10;
}

/* === SIDEBAR === */
.side-menu {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100%;
  background: linear-gradient(to bottom, #005c97, #0096c7); /* dégradé bleu médical */
  color: white;
  padding-top: 80px;
  transition: left 0.3s ease;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.15);
  z-index: 9;
}
.side-menu.open {
  left: 0;
}
.side-menu ul {
  list-style: none;
  padding: 0 20px;
}
.side-menu li,
.logout-button {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: none;
  color: #ecf0f1;
  transition: background 0.2s;
}
.side-menu li:hover,
.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 10px;
  border-radius: 6px;
}

/* === TITRE PRINCIPAL === */
.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-top: 100px;
  color: #2c3e50;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  display: inline-block;
  position: relative;
  z-index: 1;
}

/* === RESPONSIVE === */
@media screen and (max-width: 600px) {
  .dashboard-title {
    font-size: 22px;
    margin-top: 80px;
  }
}

</style>
