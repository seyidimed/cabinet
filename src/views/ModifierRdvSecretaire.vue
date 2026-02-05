<template>
  <div class="modifier-container">
    <h2>🛠 Modifier le rendez-vous</h2>

    <div class="card">
      <p><strong>Médecin :</strong> Dr. {{ medcinNom }}</p>
      <p><strong>Date actuelle :</strong> {{ date }}</p>
      <p><strong>Heure actuelle :</strong> {{ heure }}</p>

      <div class="form-group">
        <label>Nouvelle date :</label>
        <input type="date" v-model="newDate" class="form-control" />
      </div>

      <div class="form-group">
        <label>Nouvelle heure :</label>
        <select v-model="newHour" class="form-control">
          <option disabled value="">Sélectionnez une heure</option>
          <option v-for="slot in heures" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <div class="btns">
        <button class="btn btn-success" @click="modifier">Confirmer</button>
        <router-link to="/rendezvous-du-jour" class="btn btn-secondary">Annuler</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ModifierRdvSecretaire",
  data() {
    return {
      id: this.$route.query.id,
      medcinNom: this.$route.query.medcinNom,
      date: this.$route.query.date,
      heure: this.$route.query.heure,
      newDate: '',
      newHour: '',
      heures: [
        "09:00", "09:15", "09:30", "09:45", "10:00", "10:15",
        "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
        "14:30", "14:45", "15:00", "15:15", "15:30", "15:45",
        "16:00", "16:15", "16:30", "16:45", "17:00"
      ]
    };
  },
  methods: {
    async modifier() {
      if (!this.newDate || !this.newHour) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      try {
        await axios.put(`https://5224-105-136-191-137.ngrok-free.app/api/rendezvous/${this.id}`, {
          date: this.newDate,
          heure: this.newHour
        });

        alert("✅ Rendez-vous modifié !");
        this.$router.push({ name: 'RendezVousDuJour' });
      } catch (error) {
        console.error("Erreur lors de la modification :", error);
        alert("❌ Impossible de modifier le rendez-vous.");
      }
    }
  }
};
</script>

<style scoped>
.modifier-container {
  padding: 30px;
  max-width: 600px;
  margin: auto;
}
.card {
  background-color: #f9f9f9;
  border-left: 6px solid #00796b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-top: 20px;
}
.btns {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.btn {
  padding: 10px 18px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
.btn-success {
  background-color: #00796b;
  color: white;
}
.btn-secondary {
  background-color: #ccc;
  color: black;
  text-decoration: none;
}
</style>