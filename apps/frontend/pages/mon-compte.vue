<template>
  <main class="p-4 max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Mon Compte</h2>

    <div class="mb-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800">
      <p class="font-medium mb-1">ℹ️ Pourquoi ces informations ?</p>
      <p class="text-xs">
        Votre adresse et numéro de téléphone sont nécessaires pour faciliter les échanges entre
        parapentistes.
      </p>
    </div>

    <div v-if="loading">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="error" class="p-3 bg-red-50 text-red-700">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <div v-else-if="userData">
      <form @submit.prevent="updateUser" class="space-y-3">
        <div>
          <label for="email" class="block text-sm font-medium text-secondary-600 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            :value="userData.email"
            readonly
            class="w-full px-3 py-2 bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label for="firstName" class="block text-sm font-medium text-secondary-600 mb-1">
            Prénom <span class="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            required
            minlength="2"
            maxlength="50"
            class="w-full px-3 py-2 bg-gray-50 focus:bg-primary-400/10 focus:outline-none"
          />
          <p v-if="validationErrors.firstName" class="mt-1 text-xs text-red-600">
            {{ validationErrors.firstName }}
          </p>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-secondary-600 mb-1">
            Nom <span class="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            required
            minlength="2"
            maxlength="50"
            class="w-full px-3 py-2 bg-gray-50 focus:bg-primary-400/10 focus:outline-none"
          />
          <p v-if="validationErrors.lastName" class="mt-1 text-xs text-red-600">
            {{ validationErrors.lastName }}
          </p>
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-secondary-600 mb-1">
            Adresse <span class="text-red-500">*</span>
          </label>
          <input
            id="address"
            v-model="formData.address"
            type="text"
            required
            minlength="5"
            maxlength="200"
            class="w-full px-3 py-2 bg-gray-50 focus:bg-primary-400/10 focus:outline-none"
          />
          <p v-if="validationErrors.address" class="mt-1 text-xs text-red-600">
            {{ validationErrors.address }}
          </p>
        </div>

        <div>
          <label for="phoneNumber" class="block text-sm font-medium text-secondary-600 mb-1">
            Téléphone <span class="text-red-500">*</span>
          </label>
          <input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            required
            pattern="^(\+33|0)[1-9](\d{2}){4}$"
            placeholder="Ex: 0612345678"
            class="w-full px-3 py-2 bg-gray-50 focus:bg-primary-400/10 focus:outline-none"
          />
          <p v-if="validationErrors.phoneNumber" class="mt-1 text-xs text-red-600">
            {{ validationErrors.phoneNumber }}
          </p>
        </div>

        <div v-if="updateError" class="p-3 bg-red-50 text-red-700 text-sm">
          <p><strong>Erreur:</strong> {{ updateError }}</p>
        </div>

        <div v-if="updateSuccess" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
          <p>✓ Informations mises à jour</p>
        </div>

        <div class="pt-3">
          <button
            type="submit"
            :disabled="updating"
            class="bg-secondary-600 text-primary-400 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {{ updating ? 'Mise à jour...' : 'Mettre à jour' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { UserFormData, ValidationErrors } from '~/types/user';

definePageMeta({
  middleware: 'auth',
});

const {
  userData,
  loading,
  error,
  updating,
  updateError,
  updateSuccess,
  getUser,
  updateUser: updateUserData,
  validateUserForm,
} = useUser();

const formData = ref<UserFormData>({
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
});

const validationErrors = ref<ValidationErrors>({
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
});

onMounted(async () => {
  try {
    await getUser();

    if (userData.value) {
      formData.value = {
        firstName: userData.value.firstName || '',
        lastName: userData.value.lastName || '',
        address: userData.value.address || '',
        phoneNumber: userData.value.phoneNumber || '',
      };
    }
  } catch (e) {
    console.error('Error loading user:', e);
  }
});

const updateUser = async () => {
  try {
    const validation = validateUserForm(formData.value);
    validationErrors.value = validation.errors;

    if (!validation.isValid) {
      return;
    }

    await updateUserData(formData.value);
  } catch (e) {
    console.error('Error updating user:', e);
  }
};
</script>
