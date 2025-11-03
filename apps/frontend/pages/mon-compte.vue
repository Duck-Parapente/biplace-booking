<template>
  <main class="p-8">
    <h2 class="text-2xl font-semibold mb-4">Mon Compte</h2>

    <div v-if="loading" class="mt-4">
      <p class="text-gray-500">Chargement des données utilisateur...</p>
    </div>

    <div v-else-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <div v-else-if="userData" class="mt-4">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Informations du compte</h3>
        <form @submit.prevent="updateUser" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
            <input
              id="email"
              type="email"
              :value="userData.email"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              minlength="2"
              maxlength="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': validationErrors.firstName }"
            />
            <p v-if="validationErrors.firstName" class="mt-1 text-sm text-red-600">
              {{ validationErrors.firstName }}
            </p>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              minlength="2"
              maxlength="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': validationErrors.lastName }"
            />
            <p v-if="validationErrors.lastName" class="mt-1 text-sm text-red-600">
              {{ validationErrors.lastName }}
            </p>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
              Adresse <span class="text-red-500">*</span>
            </label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              required
              minlength="5"
              maxlength="200"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': validationErrors.address }"
            />
            <p v-if="validationErrors.address" class="mt-1 text-sm text-red-600">
              {{ validationErrors.address }}
            </p>
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span class="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              type="tel"
              required
              pattern="^(\+33|0)[1-9](\d{2}){4}$"
              placeholder="Ex: 0612345678 ou +33612345678"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': validationErrors.phoneNumber }"
            />
            <p v-if="validationErrors.phoneNumber" class="mt-1 text-sm text-red-600">
              {{ validationErrors.phoneNumber }}
            </p>
          </div>

          <div v-if="updateError" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p><strong>Erreur:</strong> {{ updateError }}</p>
          </div>

          <div
            v-if="updateSuccess"
            class="p-4 bg-green-100 border border-green-400 text-green-700 rounded"
          >
            <p>Informations mises à jour avec succès!</p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="updating"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updating ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { callApi } = useApi();
const userData = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const formData = ref({
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
});

const updating = ref(false);
const updateError = ref<string | null>(null);
const updateSuccess = ref(false);

const validationErrors = ref({
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
});

const validateForm = (): boolean => {
  validationErrors.value = {
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  };

  let isValid = true;

  // Validate firstName
  if (!formData.value.firstName || formData.value.firstName.trim().length === 0) {
    validationErrors.value.firstName = 'Le prénom est requis';
    isValid = false;
  } else if (formData.value.firstName.trim().length < 2) {
    validationErrors.value.firstName = 'Le prénom doit contenir au moins 2 caractères';
    isValid = false;
  } else if (formData.value.firstName.trim().length > 50) {
    validationErrors.value.firstName = 'Le prénom ne doit pas dépasser 50 caractères';
    isValid = false;
  }

  // Validate lastName
  if (!formData.value.lastName || formData.value.lastName.trim().length === 0) {
    validationErrors.value.lastName = 'Le nom est requis';
    isValid = false;
  } else if (formData.value.lastName.trim().length < 2) {
    validationErrors.value.lastName = 'Le nom doit contenir au moins 2 caractères';
    isValid = false;
  } else if (formData.value.lastName.trim().length > 50) {
    validationErrors.value.lastName = 'Le nom ne doit pas dépasser 50 caractères';
    isValid = false;
  }

  // Validate address
  if (!formData.value.address || formData.value.address.trim().length === 0) {
    validationErrors.value.address = "L'adresse est requise";
    isValid = false;
  } else if (formData.value.address.trim().length < 5) {
    validationErrors.value.address = "L'adresse doit contenir au moins 5 caractères";
    isValid = false;
  } else if (formData.value.address.trim().length > 200) {
    validationErrors.value.address = "L'adresse ne doit pas dépasser 200 caractères";
    isValid = false;
  }

  // Validate phoneNumber (French phone number format)
  if (!formData.value.phoneNumber || formData.value.phoneNumber.trim().length === 0) {
    validationErrors.value.phoneNumber = 'Le numéro de téléphone est requis';
    isValid = false;
  } else {
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    const cleanPhone = formData.value.phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      validationErrors.value.phoneNumber =
        'Le numéro de téléphone doit être au format français (ex: 0612345678 ou +33612345678)';
      isValid = false;
    }
  }

  return isValid;
};

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    userData.value = await callApi('/user/me');

    // Initialize form data with user data
    formData.value = {
      firstName: userData.value.firstName || '',
      lastName: userData.value.lastName || '',
      address: userData.value.address || '',
      phoneNumber: userData.value.phoneNumber || '',
    };
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Impossible de charger les données utilisateur';
    console.error('Failed to fetch user data:', e);
  } finally {
    loading.value = false;
  }
});

const updateUser = async () => {
  try {
    updating.value = true;
    updateError.value = null;
    updateSuccess.value = false;

    // Validate form before submitting
    if (!validateForm()) {
      updating.value = false;
      return;
    }

    await callApi('/user/update', {
      method: 'POST',
      body: JSON.stringify(formData.value),
    });

    updateSuccess.value = true;

    // Hide success message after 3 seconds
    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);
  } catch (e) {
    updateError.value =
      e instanceof Error ? e.message : 'Impossible de mettre à jour les informations';
    console.error('Failed to update user data:', e);
  } finally {
    updating.value = false;
  }
};
</script>
