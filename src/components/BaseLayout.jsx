import { Row, Col, Card } from "antd";

export default function BaseLayout({
  children,
  title,
  cardWidth = 400,
  backgroundImage,
  topLeftSrc,
  topLeftAlt,
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
      {/* top-left logo rendered outside the Card when provided */}
      {topLeftSrc && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 80,
            width: 160,
            borderRadius: 12,
            padding: 8,
            zIndex: 10,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 6px 20px rgba(31, 38, 135, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={topLeftSrc}
            alt={topLeftAlt || "logo"}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 6,
            }}
          />
        </div>
      )}

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
