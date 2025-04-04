import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  // Cost comparison data
  const costComparisonData = {
    labels: [t('votingRevolution.charts.traditional'), t('votingRevolution.charts.blockchain')],
    datasets: [
      {
        label: t('votingRevolution.charts.costPerVote'),
        data: [125, 2], // Average of 100-150 for traditional, and 1-3 for blockchain
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Total cost for 900M voters comparison
  const totalCostData = {
    labels: [t('votingRevolution.charts.traditional'), t('votingRevolution.charts.blockchain')],
    datasets: [
      {
        label: t('votingRevolution.charts.totalCostFor900M'),
        data: [112500, 1816],
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Feature comparison pie chart
  const featureComparisonData = {
    labels: [
      t('votingRevolution.features.transparency'),
      t('votingRevolution.features.security'),
      t('votingRevolution.features.speed'),
      t('votingRevolution.features.accessibility'),
      t('votingRevolution.features.costEfficiency')
    ],
    datasets: [
      {
        label: t('votingRevolution.features.blockchainAdvantages'),
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
        label: t('votingRevolution.charts.traditionalCostProjection'),
        data: [112500, 118125, 124031, 130233, 136744],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: t('votingRevolution.charts.blockchainCostProjection'),
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
            <h1>{t('votingRevolution.hero.title')}</h1>
            <h2>{t('votingRevolution.hero.subtitle')}</h2>
            <p>{t('votingRevolution.hero.description')}</p>
          </div>
        </section>

        <section className="key-comparison-section">
          <h2>{t('votingRevolution.comparison.title')}</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>{t('votingRevolution.comparison.feature')}</th>
                  <th>{t('votingRevolution.comparison.traditional')}</th>
                  <th>{t('votingRevolution.comparison.blockchain')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.costPerVote')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalCostRange')}</td>
                  <td>{t('votingRevolution.comparison.blockchainCostRange')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.totalCost1M')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditional1MCost')}</td>
                  <td>{t('votingRevolution.comparison.blockchain1MCost')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.totalCost900M')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditional900MCost')}</td>
                  <td>{t('votingRevolution.comparison.blockchain900MCost')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.transparency')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalTransparency')}</td>
                  <td>{t('votingRevolution.comparison.blockchainTransparency')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.tamperproof')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalTamperproof')}</td>
                  <td>{t('votingRevolution.comparison.blockchainTamperproof')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.verification')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalVerification')}</td>
                  <td>{t('votingRevolution.comparison.blockchainVerification')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.speed')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalSpeed')}</td>
                  <td>{t('votingRevolution.comparison.blockchainSpeed')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.remote')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalRemote')}</td>
                  <td>{t('votingRevolution.comparison.blockchainRemote')}</td>
                </tr>
                <tr>
                  <td><strong>{t('votingRevolution.comparison.scalability')}</strong></td>
                  <td>{t('votingRevolution.comparison.traditionalScalability')}</td>
                  <td>{t('votingRevolution.comparison.blockchainScalability')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <h3>{t('votingRevolution.charts.costPerVoteTitle')}</h3>
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
                      text: t('votingRevolution.charts.costPerVoteAxisTitle'),
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
            <h3>{t('votingRevolution.charts.totalCostTitle')}</h3>
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
                      text: t('votingRevolution.charts.totalCostAxisTitle'),
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
            <p className="chart-note">{t('votingRevolution.charts.costReductionNote')}</p>
          </div>

          <div className="chart-container">
            <h3>{t('votingRevolution.charts.advantagesTitle')}</h3>
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
            <h3>{t('votingRevolution.charts.projectionTitle')}</h3>
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
                      text: t('votingRevolution.charts.projectionAxisTitle'),
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('votingRevolution.charts.costInCrore')
                      }
                    }
                  }
                }}
              />
            </div>
            <p className="chart-note">{t('votingRevolution.charts.projectionNote')}</p>
          </div>
        </section>

        <section className="why-polygon-section">
          <h2>{t('votingRevolution.polygon.title')}</h2>
          <div className="benefits-container">
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.costEfficiency.title')}</h3>
              <p>{t('votingRevolution.polygon.costEfficiency.description')}</p>
            </div>
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.scalability.title')}</h3>
              <p>{t('votingRevolution.polygon.scalability.description')}</p>
            </div>
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.security.title')}</h3>
              <p>{t('votingRevolution.polygon.security.description')}</p>
            </div>
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.transparency.title')}</h3>
              <p>{t('votingRevolution.polygon.transparency.description')}</p>
            </div>
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.fasterResults.title')}</h3>
              <p>{t('votingRevolution.polygon.fasterResults.description')}</p>
            </div>
            <div className="benefit-card">
              <h3>{t('votingRevolution.polygon.remoteParticipation.title')}</h3>
              <p>{t('votingRevolution.polygon.remoteParticipation.description')}</p>
            </div>
          </div>
        </section>

        <section className="cost-breakdown-section">
          <h2>{t('votingRevolution.costBreakdown.title')}</h2>
          
          <div className="cost-breakdown-container">
            <div className="cost-breakdown traditional">
              <h3>{t('votingRevolution.costBreakdown.traditional.title')}</h3>
              <ul>
                <li><strong>{t('votingRevolution.costBreakdown.traditional.commission')}:</strong> {t('votingRevolution.costBreakdown.traditional.commissionCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.traditional.security')}:</strong> {t('votingRevolution.costBreakdown.traditional.securityCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.traditional.counting')}:</strong> {t('votingRevolution.costBreakdown.traditional.countingCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.traditional.total')}:</strong> <span className="highlight">{t('votingRevolution.costBreakdown.traditional.totalAmount')}</span></li>
              </ul>
            </div>
            
            <div className="cost-breakdown blockchain">
              <h3>{t('votingRevolution.costBreakdown.blockchain.title')}</h3>
              <ul>
                <li><strong>{t('votingRevolution.costBreakdown.blockchain.smartContract')}:</strong> {t('votingRevolution.costBreakdown.blockchain.smartContractCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.blockchain.transaction')}:</strong> {t('votingRevolution.costBreakdown.blockchain.transactionCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.blockchain.hosting')}:</strong> {t('votingRevolution.costBreakdown.blockchain.hostingCost')}</li>
                <li><strong>{t('votingRevolution.costBreakdown.blockchain.total')}:</strong> <span className="highlight">{t('votingRevolution.costBreakdown.blockchain.totalAmount')}</span> ({t('votingRevolution.costBreakdown.blockchain.savings')})</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="future-section">
          <h2>{t('votingRevolution.future.title')}</h2>
          <p>{t('votingRevolution.future.description')}</p>
          
          <div className="call-to-action">
            <h3>{t('votingRevolution.future.quote')}</h3>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default VotingRevolution; 