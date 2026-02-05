
<!-- Ajout dans le <template> de la modale -->
  <template>
    <div class="rdv-jour-container">
      <h2 class="title">📅 Rendez-vous du jour</h2>
  
      <div class="table-container">
        <table class="rdv-table">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Médecin</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rdv in rendezvous" :key="rdv.id">
              <td>{{ rdv.heure }}</td>
              <td>Dr. {{ rdv.medcinNom }}</td>
              <td>{{ rdv.nomPatient || rdv.userNom || '—' }}</td>
              <td>{{ rdv.nomPatient ? 'sur place' : 'en ligne' }}</td>
              <td class="actions">
                <button class="btn btn-warning" @click="modifierRdv(rdv)">Modifier</button>
                <button class="btn btn-danger" @click="annulerRdv(rdv.id)">Annuler</button>
  
                <button
                  class="btn btn-info"
                  @click="ouvrirModaleRetard(rdv)"
                >
                  En retard
                </button>
  
                <button class="btn btn-success" @click="finConsultation(rdv)">
                  Fin consultation
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- MODALE EN RETARD -->
      <div v-if="modaleVisible" class="modale-retard">
        <div class="modale-contenu">
          <h3>Patient en retard</h3>
          <p>Choisissez une action :</p>
          <button class="btn btn-secondary" @click="deplacerEnListeAttente">📥 Déplacer vers liste d'attente</button>
          <button class="btn btn-danger" @click="annulerRdv(rdvSelectionne.id)">🗑️ Annuler le rendez-vous</button>
          <button class="btn btn-warning" @click="marquerEnRetard">⏰ Marquer comme "En retard"</button>
          <button class="btn" @click="fermerModale">❌ Fermer</button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { db } from '@/firebase-config';
  import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    deleteDoc,
    addDoc,
    updateDoc
  } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        rendezvous: [],
        listeAttenteIds: [],
        modaleVisible: false,
        rdvSelectionne: null
      };
    },
    methods: {
      async fetchRendezVousDuJour() {
        const today = new Date().toISOString().slice(0, 10);
        const q = query(collection(db, 'rendezvous'), where('date', '==', today));
        const snapshot = await getDocs(q);
  
        const temp = [];
  
        for (const docSnap of snapshot.docs) {
          const rdv = docSnap.data();
          const baseRdv = {
            id: docSnap.id,
            ...rdv,
          };
  
          if (!rdv.nomPatient && rdv.patientID) {
            try {
              const userDoc = await getDoc(doc(db, 'users', rdv.patientID));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                baseRdv.userNom = `${userData.prenom} ${userData.nom}`;
              } else {
                baseRdv.userNom = '—';
              }
            } catch (e) {
              baseRdv.userNom = '—';
            }
          }
  
          temp.push(baseRdv);
        }
  
        this.rendezvous = temp;
        await this.fetchListeAttenteIds();
      },
  
      async fetchListeAttenteIds() {
        const snapshot = await getDocs(collection(db, 'liste_attente'));
        this.listeAttenteIds = snapshot.docs.map(doc => doc.data().rendezvousID);
      },
  
      ouvrirModaleRetard(rdv) {
        this.rdvSelectionne = rdv;
        this.modaleVisible = true;
      },
  
      fermerModale() {
        this.modaleVisible = false;
        this.rdvSelectionne = null;
      },
  
      async deplacerEnListeAttente() {
        const rdv = this.rdvSelectionne;
        if (this.listeAttenteIds.includes(rdv.id)) {
          alert("Déjà en liste d'attente");
          return;
        }
  
        try {
          await addDoc(collection(db, 'liste_attente'), {
            rendezvousID: rdv.id,
            nomPatient: rdv.nomPatient || rdv.userNom,
            medcinNom: rdv.medcinNom,
            date: rdv.date,
            heure: rdv.heure,
            type: 'sur place'
          });
  
          this.listeAttenteIds.push(rdv.id);
          alert("✅ Ajouté à la liste d’attente.");
          this.fermerModale();
        } catch (err) {
          alert("Erreur lors de l’ajout.");
        }
      },
  
      async marquerEnRetard() {
        try {
          const rdvRef = doc(db, 'rendezvous', this.rdvSelectionne.id);
          await updateDoc(rdvRef, { statut: 'en_retard' });
          alert("✅ Marqué comme en retard.");
          this.fermerModale();
        } catch (e) {
          alert("Erreur de mise à jour.");
        }
      },
  
      async annulerRdv(rdvId) {
        if (confirm("Annuler ce rendez-vous ?")) {
          try {
            await deleteDoc(doc(db, 'rendezvous', rdvId));
            this.rendezvous = this.rendezvous.filter(r => r.id !== rdvId);
            this.fermerModale();
          } catch (e) {
            alert("Erreur suppression.");
          }
        }
      },
  
      async finConsultation(rdv) {
        try {
          await addDoc(collection(db, 'historique_consultation'), {
            rendezvousID: rdv.id,
            nomPatient: rdv.nomPatient || rdv.userNom,
            medcinNom: rdv.medcinNom,
            date: rdv.date,
            heure: rdv.heure,
            note: null,
            type: rdv.nomPatient ? 'sur place' : 'en ligne',
            createdAt: new Date(),
            ...(rdv.patientID && { patientID: rdv.patientID })
          });
  
          await deleteDoc(doc(db, 'rendezvous', rdv.id));
          this.rendezvous = this.rendezvous.filter(r => r.id !== rdv.id);
          alert("✅ Consultation terminée.");
        } catch (err) {
          alert("❌ Erreur.");
        }
      },
  
      modifierRdv(rdv) {
        this.$router.push({
          name: 'ModifierRdvSecretaire',
          query: {
            id: rdv.id,
            medcinNom: rdv.medcinNom,
            date: rdv.date,
            heure: rdv.heure
          }
        });
      }
    },
    mounted() {
      this.fetchRendezVousDuJour();
    }
  };
  </script>
  
  <style>
  body {
    background-color: #d1f2f8 !important;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }
  </style>
  
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

body {
  background-color: #e6f7fa;
  margin: 0;
  padding: 0;
}

.rdv-jour-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  max-width: 1100px;
  margin: 40px auto;
  font-family: 'Poppins', sans-serif;
}


/* === TITRE === */
.title {
  text-align: center;
  color: #00796b;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  position: relative;
}

.title::before {
  content: '📅';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-35px);
  font-size: 28px;
}

/* === TABLEAU === */
.rdv-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.rdv-table th,
.rdv-table td {
  padding: 14px 20px;
  text-align: left;
  font-size: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.rdv-table th {
  background-color: #00796b;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 13px;
}

.rdv-table tr:hover {
  background-color: #f9f9f9;
}

/* === ACTIONS === */
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
}
.btn-warning:hover {
  background-color: #e67e22;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}
.btn-danger:hover {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}
.btn-secondary:hover {
  background-color: #616a6b;
}

.btn-info {
  background-color: #3498db;
  color: white;
}
.btn-info:hover {
  background-color: #2980b9;
}

.btn-success {
  background-color: #2ecc71;
  color: white;
}
.btn-success:hover {
  background-color: #27ae60;
}

/* === Responsive mobile === */
@media (max-width: 768px) {
  .rdv-table th,
  .rdv-table td {
    padding: 10px 14px;
    font-size: 14px;
  }

  .title {
    font-size: 22px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
