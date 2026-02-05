<template>
  <div class="mes-rendezvous-container container my-5">
    <h2 class="title text-center">
      📅 Mes rendez-vous
      <hr class="underline">
    </h2>

    <div v-if="rendezvous.length === 0" class="alert alert-info text-center">
      Aucun rendez-vous pour le moment.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover shadow-sm rounded bg-white">
        <thead class="table-success text-white">
          <tr class="text-uppercase text-center bg-success">
            <th>Médecin</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rdv in rendezvous" :key="rdv.id" class="align-middle">
            <td>Dr. {{ rdv.medcinNom }}</td>
            <td>{{ formatDate(rdv.date) }}</td>
            <td>{{ rdv.heure }}</td>
            <td>
              <span class="badge bg-success">{{ rdv.status }}</span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning me-2" @click="modifierRdv(rdv)">Modifier</button>
              <button class="btn btn-sm btn-danger" @click="annulerRdv(rdv.id)">Annuler</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

  
  <script>
import { db, auth } from '@/firebase-config';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      rendezvous: [],
      currentUserId: null,
    };
  },
  methods: {
    async fetchRendezvous() {
      const user = auth.currentUser;
      if (!user) {
        alert("Veuillez vous connecter.");
        this.$router.push({ name: 'login' });
        return;
      }
      this.currentUserId = user.uid;

      const q = query(
        collection(db, 'rendezvous'),
        where('patientID', '==', this.currentUserId)
      );

      try {
        const snapshot = await getDocs(q);
        this.rendezvous = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
      } catch (error) {
        console.error('Erreur récupération rendez-vous :', error);
      }
    },
    async annulerRdv(id) {
      if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
        try {
          await deleteDoc(doc(db, 'rendezvous', id));
          this.rendezvous = this.rendezvous.filter(r => r.id !== id);
        } catch (error) {
          console.error('Erreur annulation :', error);
        }
      }
    },
    modifierRdv(rdv) {
      this.$router.push({
        name: 'modifier-rendezvous',
        query: {
          id: rdv.id,
          medcinNom: rdv.medcinNom,
          date: rdv.date,
          heure: rdv.heure
        }
      });
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  async mounted() {
    await this.fetchRendezvous();
  }
};
</script>


  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.mes-rendezvous-container {
  font-family: 'Poppins', sans-serif;
  background: #f9fbfb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.title {
  font-weight: 600;
  color: #00695c;
  font-size: 28px;
  margin-bottom: 10px;
}

.underline {
  width: 80px;
  height: 3px;
  background-color: #26a69a;
  margin: 0 auto 30px;
  border-radius: 10px;
}

.badge {
  font-size: 0.85rem;
  padding: 0.5em 0.7em;
}
</style>
