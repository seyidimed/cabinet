<template>
  <div class="modifier-container">
    <h2 class="title">
      <i class="fas fa-tools"></i> Modifier le rendez-vous
    </h2>

    <div class="card">
      <div class="info-block">
        <p><i class="fas fa-user-md"></i> <strong>Médecin :</strong> Dr. {{ medcinNom }}</p>
        <p><i class="fas fa-calendar-alt"></i> <strong>Date actuelle :</strong> {{ formatDate(date) }}</p>
        <p><i class="fas fa-clock"></i> <strong>Heure actuelle :</strong> {{ heure }}</p>
      </div>

      <div class="form-group">
        <label for="date">Nouvelle date :</label>
        <input id="date" type="date" v-model="newDate" class="form-control" />
      </div>

      <div class="form-group">
        <label for="heure">Nouvelle heure :</label>
        <select id="heure" v-model="newHour" class="form-control">
          <option disabled value="">Sélectionnez une heure</option>
          <option v-for="slot in allSlots" :key="slot" :value="slot">{{ slot }}</option>
        </select>
      </div>

      <div class="buttons">
        <button class="btn btn-success" @click="modifier">
          <i class="fas fa-check-circle"></i> Confirmer
        </button>
        <router-link to="/mes-rendezvous" class="btn btn-outline-secondary">
          <i class="fas fa-times"></i> Annuler
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase-config";
import { doc, updateDoc } from "firebase/firestore";

export default {
  name: "ModifierRendezVous",
  data() {
    return {
      id: this.$route.query.id,
      medcinNom: this.$route.query.medcinNom,
      date: this.$route.query.date,
      heure: this.$route.query.heure,
      newDate: "",
      newHour: "",
      allSlots: [
        "09:00", "09:15", "09:30", "09:45",
        "10:00", "10:15", "10:30", "10:45",
        "11:00", "11:15", "11:30", "11:45",
        "14:30", "14:45", "15:00", "15:15",
        "15:30", "15:45", "16:00", "16:15",
        "16:30", "16:45", "17:00", "17:15"
      ]
    };
  },
  methods: {
    async modifier() {
      if (!this.newDate || !this.newHour) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      try {
        const rdvRef = doc(db, "rendezvous", this.id);
        await updateDoc(rdvRef, {
          date: this.newDate,
          heure: this.newHour
        });
        alert("✅ Rendez-vous modifié avec succès !");
        this.$router.push("/mes-rendezvous");
      } catch (err) {
        console.error("Erreur lors de la mise à jour du rendez-vous :", err);
        alert("❌ Erreur lors de la modification.");
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.modifier-container {
  padding: 40px 20px;
  max-width: 700px;
  margin: auto;
  font-family: 'Poppins', sans-serif;
}

.title {
  color: #00695c;
  text-align: center;
  margin-bottom: 30px;
  font-size: 26px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.card {
  background: #e0f7fa;
  border-left: 6px solid #00796b;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.info-block p {
  font-size: 15px;
  color: #004d40;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  margin-top: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #00796b;
}

input[type="date"], select.form-control {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #b2dfdb;
  background-color: #f9fdfd;
  font-size: 15px;
  color: #333;
}

.buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.btn-success {
  background-color: #009688;
  color: white;
}

.btn-success:hover {
  background-color: #00796b;
}

.btn-outline-secondary {
  background-color: #eeeeee;
  color: #444;
}

.btn-outline-secondary:hover {
  background-color: #cccccc;
}
</style>
