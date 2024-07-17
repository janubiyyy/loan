<template>
  <div class="loan-list-container">
    <!-- Container utama -->
    <div v-if="!showDetail">
      <!-- Daftar pinjaman -->
      <h1>Loan List</h1>
      <!-- Filter -->
      <div class="filters">
        <div class="filter-group">
          <label>Filter by Amount:</label>
          <input v-model="filter.amount" @input="applyFilters" />
        </div>
        <div class="filter-group">
          <label>Filter by Rate:</label>
          <input v-model="filter.rate" @input="applyFilters" />
        </div>
        <div class="filter-group">
          <label>Filter by Term:</label>
          <input v-model="filter.term" @input="applyFilters" />
        </div>
        <div class="filter-group">
          <label>Sort by:</label>
          <select v-model="sortKey" @change="applyFilters">
            <option value="amount">Amount</option>
            <option value="rate">Rate</option>
            <option value="term">Term</option>
          </select>
        </div>
      </div>

      <!-- Tabel Daftar Pinjaman -->
      <div v-if="filteredLoans.length > 0" class="table-responsive">
        <table class="loan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Term</th>
              <th>Purpose</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(loan, index) in paginatedLoans"
              :key="loan.id"
              @click="showLoanDetail(loan)"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ loan.amount }}</td>
              <td>{{ loan.interestRate }}</td>
              <td>{{ loan.term }}</td>
              <td>{{ loan.purpose }}</td>
              <td>{{ loan.riskRating }}</td>
              <td>
                <button @click.stop="showLoanDetail(loan)">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tampilan jika tidak ada pinjaman yang ditemukan -->
      <div v-else class="no-results">No loans found.</div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="arrow"
        >
          &laquo;
        </button>
        <button
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          @click="goToPage(pageNumber)"
          :class="{ active: pageNumber === currentPage }"
        >
          {{ pageNumber }}
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="arrow"
        >
          &raquo;
        </button>
      </div>

      <!-- Visualisasi Data Pinjaman -->
      <div class="chart-container">
        <div>
          <h2>Loan Data Visualization</h2>
          <canvas id="loanChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Komponen Detail Pinjaman -->
    <div v-else>
      <loan-detail :loan="selectedLoan" @close="closeLoanDetail"></loan-detail>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoanDetail from "./LoanDetails.vue";
import Chart from "chart.js/auto";

export default {
  components: {
    LoanDetail,
  },
  data() {
    return {
      loans: [], // Daftar pinjaman dari API
      filteredLoans: [], // Daftar pinjaman yang sudah difilter
      filter: {
        amount: "", // Filter berdasarkan jumlah pinjaman
        rate: "", // Filter berdasarkan tingkat suku bunga
        term: "", // Filter berdasarkan jangka waktu
      },
      sortKey: "amount", // Kunci untuk pengurutan (jumlah pinjaman default)
      selectedLoan: null, // Detail pinjaman yang dipilih untuk ditampilkan
      showDetail: false, // Menunjukkan apakah komponen detail pinjaman ditampilkan
      currentPage: 1, // Halaman saat ini pada pagination
      itemsPerPage: 5, // Jumlah item per halaman pada pagination
    };
  },
  computed: {
    paginatedLoans() {
      // Menghitung daftar pinjaman yang akan ditampilkan di halaman saat ini
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredLoans.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },
    totalPages() {
      // Menghitung total halaman berdasarkan jumlah pinjaman yang sudah difilter
      return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
    },
  },
  mounted() {
    // Memuat data pinjaman saat komponen dimuat
    const cachedLoans = localStorage.getItem("cachedLoans");
    if (cachedLoans) {
      // Mengambil data pinjaman dari local storage jika tersedia
      this.loans = JSON.parse(cachedLoans);
      this.filteredLoans = JSON.parse(cachedLoans);
      this.setupLoanChart(); // Menyiapkan visualisasi data pinjaman
    } else {
      // Mengambil data pinjaman dari API jika tidak tersedia di local storage
      axios
        .get(
          "https://raw.githubusercontent.com/andreascandle/p2p_json_test/main/api/json/loans.json"
        )
        .then((response) => {
          this.loans = response.data;
          this.filteredLoans = response.data;
          localStorage.setItem("cachedLoans", JSON.stringify(response.data));
          this.setupLoanChart(); // Menyiapkan visualisasi data pinjaman
        });
    }
  },
  methods: {
    // Menyiapkan visualisasi data pinjaman menggunakan Chart.js
    setupLoanChart() {
      const purposes = this.loans.map((loan) => loan.purpose);
      const uniquePurposes = [...new Set(purposes)];
      const loansByPurpose = uniquePurposes.map((purpose) => {
        const loansFiltered = this.loans.filter(
          (loan) => loan.purpose === purpose
        );
        return loansFiltered.length;
      });

      const ctx = document.getElementById("loanChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: uniquePurposes,
          datasets: [
            {
              label: "Loan Count",
              data: loansByPurpose,
              backgroundColor: "#007bff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    },
    // Memfilter daftar pinjaman berdasarkan input pengguna
    applyFilters() {
      this.filteredLoans = this.loans
        .filter((loan) => {
          return (
            (!this.filter.amount ||
              loan.amount.toString().includes(this.filter.amount)) &&
            (!this.filter.rate ||
              loan.rate.toString().includes(this.filter.rate)) &&
            (!this.filter.term ||
              loan.term.toString().includes(this.filter.term))
          );
        })
        .sort((a, b) => {
          if (this.sortKey === "amount") return a.amount - b.amount;
          if (this.sortKey === "rate") return a.rate - b.rate;
          if (this.sortKey === "term") return a.term - b.term;
        });
      this.currentPage = 1; // Kembali ke halaman pertama setelah filter berubah
    },
    // Menampilkan detail pinjaman
    showLoanDetail(loan) {
      this.selectedLoan = loan;
      this.showDetail = true;
    },
    // Menutup komponen detail pinjaman
    closeLoanDetail() {
      this.showDetail = false;
      this.selectedLoan = null;
    },
    // Navigasi ke halaman lain pada pagination
    goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) return;
      this.currentPage = pageNumber;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>
<style scoped>
.loan-list-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.filter-group input,
.filter-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.table-responsive {
  overflow-x: auto;
}

.loan-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.loan-table th,
.loan-table td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: left;
  transition: background-color 0.3s ease;
}

.loan-table th {
  background-color: #f7f7f7;
}

.loan-table tbody tr:hover {
  background-color: #f1f1f1;
}

.loan-table td button {
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.loan-table td button:hover {
  background-color: #0056b3;
}

@media (max-width: 600px) {
  .loan-table th,
  .loan-table td {
    padding: 10px;
  }

  .loan-table td button {
    padding: 6px 10px;
  }
}

.no-results {
  margin-top: 20px;
  font-size: 18px;
  color: red;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.pagination button.active,
.pagination button:hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.pagination button.arrow {
  padding: 10px 15px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 10px;
  }

  .loan-table th,
  .loan-table td {
    padding: 10px;
  }

  .pagination button {
    padding: 8px 12px;
  }
}
</style>
