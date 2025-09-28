import { Row, Col, Card } from "antd";

export default function BaseLayout({
  children,
  title,
  cardWidth = 400,
  backgroundImage,
}) {
  const isGlass = Boolean(backgroundImage);

  const containerStyle = {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    background: backgroundImage
      ? `url(${backgroundImage}) center/cover no-repeat`
      : "#f5f7fa",
    backgroundSize: "cover",
  };

  const cardStyle = isGlass
    ? {
        width: cardWidth,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.12)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }
    : { width: cardWidth, background: "rgba(255,255,255,0.96)" };

  return (
    <Row justify="center" align="middle" style={containerStyle}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={cardStyle} bodyStyle={{ padding: 24 }}>
            {title && (
              <h2 style={{ textAlign: "center", marginTop: 0 }}>{title}</h2>
            )}
            <div>{children}</div>
          </Card>
        </div>
      </Col>
    </Row>
  );
}
