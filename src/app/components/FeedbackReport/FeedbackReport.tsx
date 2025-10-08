import React from "react";
import styles from "./FeedbackReport.module.css";

interface Feedback {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
}

const FeedbackReport: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  const scoreEntries = Object.entries(feedback.scores);

  return (
    <div className={styles.reportCard}>
      <h2 className={styles.title}>Call Quality Feedback Report</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scoreEntries.map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.cardsContainer}>
        <div className={styles.infoCard}>
          <h3>Overall Feedback</h3>
          <p>{feedback.overallFeedback}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Observation</h3>
          <p>{feedback.observation}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReport;
