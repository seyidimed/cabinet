<template>
  <div class="login-container">
    <div class="card p-4">
      <h2 class="text-center mb-3">Bienvenue</h2>

      <div v-if="mode === 'login'">
        <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="form-control mb-2" />
        <button class="btn btn-light w-100 mb-2" @click="login">Se connecter</button>
        <div class="d-flex justify-content-between">
          <a href="#" @click.prevent="mode = 'forgot'">Mot de passe oublié ?</a>
          <a href="#" @click.prevent="mode = 'register'">Créer un compte</a>
        </div>
      </div>

      <div v-else-if="mode === 'register'">
        <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="form-control mb-2" />
        <button class="btn btn-light w-100 mb-2" @click="register">Créer le compte</button>
        <a href="#" @click.prevent="mode = 'login'">Déjà un compte ? Se connecter</a>
      </div>

      <div v-else-if="mode === 'forgot'">
        <input v-model="email" type="email" placeholder="Entrez votre email" class="form-control mb-2" />
        <button class="btn btn-light w-100 mb-2" @click="recover">Envoyer un lien de réinitialisation</button>
        <a href="#" @click.prevent="mode = 'login'">Retour à la connexion</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      mode: 'login' // 'login', 'register', 'forgot'
    };
  },
  methods: {
    login() {
      alert(`Connexion avec ${this.email} / ${this.password}`);
    },
    register() {
      alert(`Création du compte pour ${this.email}`);
    },
    recover() {
      alert(`Lien de récupération envoyé à ${this.email}`);
    }
  }
};
</script>

