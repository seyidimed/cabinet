<template>
  <div class="container">
    <!-- Sélection de la spécialité -->
    <div class="mb-3">
      <label>Spécialité :</label>
      <select v-model="selectedSpecialty" class="form-control">
        <option disabled value="">Sélectionnez une spécialité</option>
        <option v-for="spec in specialties" :key="spec">{{ spec }}</option>
      </select>
    </div>

    <!-- Sélection du médecin -->
    <div v-if="selectedSpecialty" class="mb-3">
      <label>Médecin :</label>
      <select v-model="selectedDoctor" class="form-control">
        <option disabled value="">Sélectionnez un médecin</option>
        <option v-for="doctor in filteredDoctors" :key="doctor.id" :value="doctor">
          {{ doctor.nom }}
        </option>
      </select>
    </div>
    <transition-group name="fade-slide" tag="div" class="days">
  <div class="day-column" v-for="(day, index) in joursDisponibles" :key="index">
    <h6>{{ day.jour }}</h6>
    <div class="slots">
      <button
        v-for="(slot, i) in day.creneaux"
        :key="i"
        :disabled="slot.reserve"
        class="slot-btn"
      >
        {{ slot.heure }}
      </button>
    </div>
  </div>
</transition-group>

    <!-- Affichage des créneaux sous forme de calendrier -->
    <div v-if="selectedDoctor && disponibilites.length" class="mt-4">
      <h5>Créneaux disponibles de {{ selectedDoctor.nom }} :</h5>
      <div class="days">
        <div v-for="(dispo, index) in disponibilites" :key="index" class="day-column">
          <h6>{{ formatDate(dispo.date) }}</h6>
          <div class="slots">
            <button
              v-for="(heure, i) in dispo.creneaux"
              :key="i"
              class="slot-btn"
              :disabled="isSlotReserved(dispo.date, heure)"
              @click="selectSlot(dispo.date, heure)"
            >
              <span v-if="isSlotReserved(dispo.date, heure)">Déjà réservé</span>
              <span v-else>{{ heure }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation du rendez-vous -->
    <div v-if="selectedDate && selectedHour" class="mt-3">
      <p>Rendez-vous sélectionné pour le {{ selectedDate }} à {{ selectedHour }} avec le Dr. {{ selectedDoctor.nom }}</p>
      <button class="btn btn-success" @click="confirmAppointment">Confirmer le rendez-vous</button>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase-config';
import { addDoc, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      specialties: ['Cardiologie', 'Dermatologie', 'Pédiatrie'],
      selectedSpecialty: '',
      selectedDoctor: null,
      disponibilites: [],
      reservedSlots: [],
      selectedDate: '',
      selectedHour: '',
      doctors: [],
    };
  },

  computed: {
    filteredDoctors() {
      return this.doctors.filter(doctor => doctor.specialite === this.selectedSpecialty);
    }
  },

  methods: {
    selectSlot(date, hour) {
      this.selectedDate = date;
      this.selectedHour = hour;
    },

    isSlotReserved(date, heure) {
      return this.reservedSlots.some(r => r.date === date && r.heure === heure);
    },

    async confirmAppointment() {
      if (!this.selectedDate || !this.selectedHour) {
        alert('Veuillez sélectionner un créneau horaire');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        alert("Utilisateur non connecté.");
        return;
      }

      // Récupérer les infos du patient depuis Firestore
      const userRef = doc(db, 'patients', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      const appointmentData = {
        patientID: user.uid,
        nomPatient: `${userData.prenom || ''} ${userData.nom || ''}`.trim(),
        medecinID: this.selectedDoctor.id,
        medcinNom: this.selectedDoctor.nom,
        date: this.selectedDate,
        heure: this.selectedHour,
        status: 'Confirmé',
        typeRdv: 'enligne',
        timestamp: new Date()
      };

      try {
        await addDoc(collection(db, 'rendezvous'), appointmentData);
        alert(`✅ Rendez-vous confirmé avec le Dr. ${this.selectedDoctor.nom} à ${this.selectedHour} le ${this.selectedDate}`);
        this.selectedDate = '';
        this.selectedHour = '';
        await this.fetchReservedSlots();
      } catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        alert('❌ Erreur lors de la prise du rendez-vous');
      }
    },

    async fetchDisponibilites() {
      if (!this.selectedDoctor) return;
      const q = query(
        collection(db, 'disponibilites'),
        where('medcinNom', '==', this.selectedDoctor.nom)
      );
      const snapshot = await getDocs(q);
      this.disponibilites = snapshot.docs.map(doc => doc.data());
      await this.fetchReservedSlots();
    },

    async fetchReservedSlots() {
      const q = query(
        collection(db, 'rendezvous'),
        where('medcinNom', '==', this.selectedDoctor.nom)
      );
      const snapshot = await getDocs(q);
      this.reservedSlots = snapshot.docs.map(doc => doc.data());
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long', day: '2-digit', month: 'short'
      });
    },

    async fetchDoctors() {
      const snapshot = await getDocs(collection(db, 'medecins'));
      this.doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  watch: {
    selectedDoctor() {
      this.fetchDisponibilites();
    }
  },

  async mounted() {
    await this.fetchDoctors();
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', sans-serif;
}

/* ===================== */
/* === CHAMPS ET LABEL === */
/* ===================== */

label {
  font-weight: 500;
  margin-bottom: 6px;
  display: inline-block;
  color: #00796b;
  font-size: 15px;
}

select.form-control,
input[type="text"],
input[type="date"],
input[type="time"] {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cce0e3;
  background-color: #f8fbfc;
  font-size: 16px;
  margin-top: 4px;
  transition: border 0.3s, box-shadow 0.2s ease;
}

select.form-control:focus,
input:focus {
  outline: none;
  border-color: #26a69a;
  box-shadow: 0 0 0 3px rgba(38, 166, 154, 0.15);
}

/* ===================== */
/* === BLOC JOURNÉES === */
/* ===================== */

.days {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.day-column {
  flex: 1 1 240px;
  border: 1px solid #d0e3e6;
  background-color: #f1f9fa;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, border-color 0.3s ease;
  position: relative;
}

.day-column:hover {
  transform: translateY(-3px);
  border-color: #00bcd4;
}

.day-column h6 {
  color: #0097a7;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 17px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.day-column h6::before {
  content: '📅';
  font-size: 18px;
}

/* ===================== */
/* === CRÉNEAUX HORAIRES === */
/* ===================== */

.slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slot-btn {
  background-color: #26a69a;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: background-color 0.3s, transform 0.2s;
}

.slot-btn:hover:not(:disabled) {
  background-color: #2bbbad;
  transform: scale(1.02);
}

.slot-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
  color: #607d8b;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.slot-btn:disabled::before {
  content: '🔒';
  margin-right: 6px;
}

/* ===================== */
/* === BOUTON VALIDER === */
/* ===================== */

.mt-3, .mt-4, .mb-3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.btn-success {
  background-color: #009688;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.btn-success:hover {
  background-color: #00796b;
}
/* === Animation d’apparition pour les créneaux === */
.fade-slide-enter-active {
  transition: all 0.4s ease;
}
.fade-slide-leave-active {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}


/* ===================== */
/* === MESSAGE INFO === */
/* ===================== */

p {
  background-color: #e0f2f1;
  border-left: 6px solid #009688;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 20px;
  color: #004d40;
}

/* ===================== */
/* === RESPONSIVE === */
/* ===================== */

@media screen and (max-width: 768px) {
  .days {
    flex-direction: column;
  }

  .day-column {
    width: 100%;
  }
}
</style>
