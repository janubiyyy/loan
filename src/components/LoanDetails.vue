<template>
  <!-- Komponen untuk menampilkan detail pinjaman -->
  <div class="loan-details">
    <!-- Bagian header dengan tombol kembali -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h1 class="mb-0">Loan Details</h1></div>
      <div>
        <button @click="$emit('close')" class="btn btn-primary">
          Back to List
        </button>
      </div>
    </div>

    <!-- Bagian detail pinjaman -->
    <div style="margin-top: 20px;" class="details">
      <!-- Informasi umum -->
      <div class="info-section">
        <div class="info-item">
          <p><strong>Amount:</strong></p>
          <p class="value">${{ loan.amount }}</p>
        </div>
        <div class="info-item">
          <p><strong>Interest Rate:</strong></p>
          <p class="value">{{ loan.interestRate }}%</p>
        </div>
        <div class="info-item">
          <p><strong>Term:</strong></p>
          <p class="value">{{ loan.term }} months</p>
        </div>
        <div class="info-item">
          <p><strong>Purpose:</strong></p>
          <p class="value">{{ loan.purpose }}</p>
        </div>
        <div class="info-item">
          <p><strong>Risk Rating:</strong></p>
          <p class="value">{{ loan.riskRating }}</p>
        </div>
      </div>
      <hr />

      <!-- Informasi peminjam -->
      <h2>Borrower Information</h2>
      <div class="info-section">
        <div class="info-item">
          <p><strong>Name:</strong></p>
          <p class="value">{{ loan.borrower.name }}</p>
        </div>
        <div class="info-item">
          <p><strong>Email:</strong></p>
          <p class="value">{{ loan.borrower.email }}</p>
        </div>
        <div class="info-item">
          <p><strong>Credit Score:</strong></p>
          <p class="value">{{ loan.borrower.creditScore }}</p>
        </div>
      </div>
      <hr />

      <!-- Informasi jaminan -->
      <h2>Collateral</h2>
      <div class="info-section">
        <div class="info-item">
          <p><strong>Type:</strong></p>
          <p class="value">{{ loan.collateral.type }}</p>
        </div>
        <div class="info-item">
          <p><strong>Value:</strong></p>
          <p class="value">${{ loan.collateral.value }}</p>
        </div>
      </div>
      <hr />

      <!-- Daftar dokumen -->
      <h2>Documents</h2>
      <ul class="documents-list">
        <li v-for="document in loan.documents" :key="document.type">
          <a :href="document.url" target="_blank">{{ document.type }}</a>
        </li>
      </ul>
      <hr />

      <!-- Jadwal pembayaran -->
      <h2>Repayment Schedule</h2>
      <table class="repayment-table">
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Amount Due</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="installment in loan.repaymentSchedule.installments" :key="installment.dueDate">
            <td>{{ installment.dueDate }}</td>
            <td>${{ installment.amountDue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // Properti untuk data pinjaman
    loan: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* style untuk komponen detail pinjaman */
.loan-details {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.details {
  margin-bottom: 20px;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 6px;
}

.info-item p {
  margin: 5px 0;
}

.info-item .value {
  font-weight: bold;
}

.documents-list {
  list-style: none;
  padding: 0;
}

.documents-list li {
  margin-bottom: 5px;
}

.documents-list a {
  color: #007bff;
  text-decoration: none;
}

.documents-list a:hover {
  text-decoration: underline;
}

.repayment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.repayment-table th,
.repayment-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.repayment-table th {
  background-color: #f0f0f0;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
