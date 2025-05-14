// AdminDashboard.jsx
import React, { useState } from "react";
import { Card, Row, Col, Container, DropdownButton, Dropdown } from "react-bootstrap";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const AdminDashboard = () => {
  const insuranceStats = {
    "Bike Insurance": 61,
    "Car Insurance": 50,
    "Health Insurance": 100,
    "Term Insurance": 100,
    "Investment Plans": 100,
  };

  const [selectedType, setSelectedType] = useState("All");

  const pieData = {
    labels: Object.keys(insuranceStats),
    datasets: [
      {
        label: "Insurance Distribution",
        data: Object.values(insuranceStats),
        backgroundColor: ["#007bff", "#20c997", "#ffc107", "#fd7e14", "#6f42c1"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: selectedType === "All" ? Object.keys(insuranceStats) : [selectedType],
    datasets: [
      {
        label: "Policies Count",
        data:
          selectedType === "All"
            ? Object.values(insuranceStats)
            : [insuranceStats[selectedType]],
        backgroundColor:
          selectedType === "All"
            ? ["#007bff", "#20c997", "#ffc107", "#fd7e14", "#6f42c1"]
            : ["#17a2b8"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Growth Over Months",
        data: [20, 40, 60, 80, 100],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center fw-bold mb-4">Admin Dashboard</h2>
      <Row xs={1} sm={2} md={3} className="g-3 mb-4">
        {Object.entries(insuranceStats).map(([type, value]) => (
          <Col key={type}>
            <Card
              className="shadow-sm border-start border-4"
              style={{ borderColor: getColor(type) }}
            >
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted fst-italic">
                  {type}
                </Card.Subtitle>
                <Card.Title className="fs-4 fw-bold" style={{paddingLeft:'30px'}}>{value}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h4 className="text-center fw-semibold mb-3">Insurance Types Distribution</h4>
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Pie data={pieData} />
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Bar Graph</h5>
            <DropdownButton
              title={`Filter: ${selectedType}`}
              onSelect={(val) => setSelectedType(val)}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {Object.keys(insuranceStats).map((type) => (
                <Dropdown.Item key={type} eventKey={type}>
                  {type}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <Bar data={barData} />
        </Col>
      </Row>

      <h4 className="text-center fw-semibold mb-3">Monthly Growth</h4>
      <Row className="mb-5">
        <Col md={12}>
          <Line data={lineData} />
        </Col>
      </Row>
    </Container>
  );
};

const getColor = (type) => {
  const colorMap = {
    "Bike Insurance": "#007bff",
    "Car Insurance": "#20c997",
    "Health Insurance": "#ffc107",
    "Term Insurance": "#fd7e14",
    "Investment Plans": "#6f42c1",
  };
  return colorMap[type] || "#000";
};

export default AdminDashboard;

