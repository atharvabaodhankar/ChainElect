import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import '../styles/VotingRevolution.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const VotingRevolution = () => {
  // Cost comparison data
  const costComparisonData = {
    labels: ['Traditional Voting', 'Blockchain Voting (Polygon PoS)'],
    datasets: [
      {
        label: 'Cost per Vote (INR)',
        data: [125, 2], // Average of 100-150 for traditional, and 1-3 for blockchain
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Total cost for 900M voters comparison
  const totalCostData = {
    labels: ['Traditional Voting', 'Blockchain Voting'],
    datasets: [
      {
        label: 'Total Cost for 900M Voters (INR Crore)',
        data: [112500, 1816],
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Feature comparison pie chart
  const featureComparisonData = {
    labels: ['Transparency', 'Security', 'Speed', 'Accessibility', 'Cost-Efficiency'],
    datasets: [
      {
        label: 'Blockchain Advantages (%)',
        data: [95, 98, 99, 90, 98],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cost projection over time
  const costProjectionData = {
    labels: ['2024', '2025', '2026', '2027', '2028'],
    datasets: [
      {
        label: 'Traditional Voting Cost Projection (Crore INR)',
        data: [112500, 118125, 124031, 130233, 136744],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Blockchain Voting Cost Projection (Crore INR)',
        data: [1816, 1725, 1639, 1557, 1479], // Assumes 5% reduction in cost each year due to technology improvements
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="voting-revolution-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Blockchain Voting vs. Traditional Voting</h1>
            <h2>A Revolutionary Approach to Democracy</h2>
            <p>Discover how blockchain technology using Polygon PoS is transforming the voting landscape with up to 98.4% cost reduction.</p>
          </div>
        </section>

        <section className="key-comparison-section">
          <h2>Key Comparison Metrics</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Voting System</th>
                  <th>Blockchain Voting (Polygon PoS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cost per vote</strong></td>
                  <td>INR 100-150</td>
                  <td>INR 1-3</td>
                </tr>
                <tr>
                  <td><strong>Total cost for 1M voters</strong></td>
                  <td>INR 12.5 crore</td>
                  <td>INR 20.18 lakh</td>
                </tr>
                <tr>
                  <td><strong>Total cost for 900M voters</strong></td>
                  <td>INR 112,500 crore</td>
                  <td>INR 1,816 crore</td>
                </tr>
                <tr>
                  <td><strong>Transparency</strong></td>
                  <td>Moderate (prone to fraud)</td>
                  <td>High (immutable ledger)</td>
                </tr>
                <tr>
                  <td><strong>Tamper-proof</strong></td>
                  <td>No (can be rigged)</td>
                  <td>Yes (blockchain security)</td>
                </tr>
                <tr>
                  <td><strong>Vote verification</strong></td>
                  <td>Manual & error-prone</td>
                  <td>Cryptographically verifiable</td>
                </tr>
                <tr>
                  <td><strong>Speed of vote counting</strong></td>
                  <td>Days</td>
                  <td>Instantaneous</td>
                </tr>
                <tr>
                  <td><strong>Remote voting</strong></td>
                  <td>No</td>
                  <td>Yes (internet access required)</td>
                </tr>
                <tr>
                  <td><strong>Scalability</strong></td>
                  <td>Low</td>
                  <td>High</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <h3>Cost Per Vote Comparison</h3>
            <div className="chart">
              <Bar 
                data={costComparisonData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Cost Per Vote (INR)',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="chart-container">
            <h3>Total Election Cost for 900M Voters</h3>
            <div className="chart">
              <Bar 
                data={totalCostData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Total Cost (INR Crore)',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }}
              />
            </div>
            <p className="chart-note">Blockchain voting offers a <strong>98.4% cost reduction</strong> compared to traditional voting methods.</p>
          </div>

          <div className="chart-container">
            <h3>Blockchain Voting System Advantages</h3>
            <div className="advantages-chart-container">
              <div className="chart pie-chart">
                <Pie 
                  data={featureComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: false,
                      },
                    },
                    layout: {
                      padding: 20
                    },
                    elements: {
                      arc: {
                        borderWidth: 0
                      }
                    }
                  }}
                />
              </div>
              <div className="advantages-legend">
                {featureComparisonData.labels.map((label, index) => (
                  <div key={label} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{
                        backgroundColor: featureComparisonData.datasets[0].backgroundColor[index]
                      }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-container full-width">
            <h3>Cost Projection Over Time (2024-2028)</h3>
            <div className="chart">
              <Line 
                data={costProjectionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Cost Projection Over Time',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Cost in Crore INR'
                      }
                    }
                  }
                }}
              />
            </div>
            <p className="chart-note">While traditional voting costs continue to rise, blockchain voting costs are projected to decrease over time due to technological advancements.</p>
          </div>
        </section>

        <section className="why-polygon-section">
          <h2>Why Use Polygon PoS for Voting?</h2>
          <div className="benefits-container">
            <div className="benefit-card">
              <h3>Cost Efficiency</h3>
              <p>Up to <strong>98.4% cost reduction</strong> compared to traditional elections.</p>
            </div>
            <div className="benefit-card">
              <h3>Scalability</h3>
              <p>Polygon PoS can handle <strong>millions of transactions per second</strong>.</p>
            </div>
            <div className="benefit-card">
              <h3>Security</h3>
              <p>Blockchain prevents fraud and vote tampering.</p>
            </div>
            <div className="benefit-card">
              <h3>Transparency</h3>
              <p>Every vote is recorded on an immutable ledger, ensuring <strong>zero manipulation</strong>.</p>
            </div>
            <div className="benefit-card">
              <h3>Faster Results</h3>
              <p>Vote counting is <strong>instant</strong>, eliminating long delays in election results.</p>
            </div>
            <div className="benefit-card">
              <h3>Remote Participation</h3>
              <p>Enables voting from <strong>anywhere in the world</strong> with internet access.</p>
            </div>
          </div>
        </section>

        <section className="cost-breakdown-section">
          <h2>Cost Breakdown Analysis</h2>
          
          <div className="cost-breakdown-container">
            <div className="cost-breakdown traditional">
              <h3>Traditional Voting: Cost Breakdown</h3>
              <ul>
                <li><strong>Election Commission Expenses:</strong> INR 100-150 per voter for polling booths, manpower, paper ballots, and logistics.</li>
                <li><strong>Security Arrangements:</strong> High cost due to police and monitoring needs.</li>
                <li><strong>Manual Vote Counting:</strong> Slow and expensive process with high labor costs.</li>
                <li><strong>Total Cost for National Elections (900M voters):</strong> <span className="highlight">INR 112,500 crore</span></li>
              </ul>
            </div>
            
            <div className="cost-breakdown blockchain">
              <h3>Blockchain Voting: Cost Breakdown (Using Polygon PoS)</h3>
              <ul>
                <li><strong>Smart Contract Deployment:</strong> One-time cost of ~INR 12,000.</li>
                <li><strong>Per Vote Transaction Fee:</strong> INR 1-3 per vote.</li>
                <li><strong>Hosting & Database Costs:</strong> Approx. INR 6,000 per month (for web infrastructure).</li>
                <li><strong>Total Cost for National Elections (900M voters):</strong> <span className="highlight">INR 1,816 crore</span> (Savings of <strong>98.4%</strong> compared to traditional voting).</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="future-section">
          <h2>The Future of Voting</h2>
          <p>Adopting blockchain-based voting systems can revolutionize the democratic process by making it <strong>faster, cheaper, and more secure</strong>. With platforms like <strong>Polygon PoS</strong>, countries can save <strong>thousands of crores</strong> while ensuring <strong>100% transparency and security</strong> in elections.</p>
          
          <div className="call-to-action">
            <h3>"The future of elections is digital, decentralized, and secure. Let's embrace blockchain voting for a better democracy!"</h3>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default VotingRevolution; 