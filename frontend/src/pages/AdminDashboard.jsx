import { useEffect, useState } from "react";
import { api } from "../lib/api";
import "./Pages.css";

const sections = [
  { id: "overview", label: "📊 Dashboard" },
  { id: "bookings", label: "📅 Bookings" },
  { id: "consultations", label: "💬 Consultations" },
  { id: "gallery", label: "🖼️ Gallery" },
  { id: "services", label: "🛍️ Services" },
  { id: "rentals", label: "🚜 Rentals" },
  { id: "quotations", label: "💰 Quotations" },
  { id: "reviews", label: "⭐ Reviews" },
  { id: "notifications", label: "🔔 Notifications" },
  { id: "customers", label: "👥 Customers" },
  { id: "settings", label: "⚙️ Settings" },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    type: null,
    item: null,
  });

  const loadData = async () => {
    setLoading(true);

    const requests = [
      api("/bookings"),
      api("/users"),
      safeApi("/consultations"),
      safeApi("/gallery"),
      safeApi("/services"),
      safeApi("/rentals"),
      safeApi("/quotations"),
      safeApi("/reviews"),
      safeApi("/notifications"),
    ];

    const results = await Promise.allSettled(requests);

    setBookings(results[0].status === "fulfilled" ? results[0].value || [] : []);
    setUsers(results[1].status === "fulfilled" ? results[1].value || [] : []);
    setConsultations(results[2].status === "fulfilled" ? results[2].value || [] : []);
    setGallery(results[3].status === "fulfilled" ? results[3].value || [] : []);
    setServices(results[4].status === "fulfilled" ? results[4].value || [] : []);
    setRentals(results[5].status === "fulfilled" ? results[5].value || [] : []);
    setQuotations(results[6].status === "fulfilled" ? results[6].value || [] : []);
    setReviews(results[7].status === "fulfilled" ? results[7].value || [] : []);
    setNotifications(
      results[8].status === "fulfilled" ? results[8].value || [] : []
    );

    setLoading(false);
  };

  async function safeApi(url, options) {
    try {
      const result = await api(url, options);

      if (Array.isArray(result)) {
        return result;
      }

      return result?.content || result?.data || [];
    } catch {
      return [];
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const updateBooking = async (id, status) => {
    try {
      await api(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await loadData();
    } catch (error) {
      alert(error.message || "Unable to update booking.");
    }
  };

  const deleteItem = async (endpoint, id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name || "this item"}?`
    );

    if (!confirmed) return;

    try {
      await api(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      await loadData();
    } catch (error) {
      alert(error.message || "Delete operation failed.");
    }
  };

  const updateStatus = async (endpoint, id, status) => {
    try {
      await api(`${endpoint}/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await loadData();
    } catch (error) {
      alert(error.message || "Unable to update status.");
    }
  };

  if (loading) {
    return (
      <main className="dashboard page">
        <section className="section-shell">
          <div className="admin-loading">
            <div className="loader"></div>
            Loading EventAura Administration...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-layout">

        {/* =========================================
            ADMIN SIDEBAR
        ========================================= */}

        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-mark">SM</div>

            <div>
              <strong>EventAura</strong>
              <span>Administration</span>
            </div>
          </div>

          <div className="admin-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={
                  activeSection === section.id
                    ? "admin-nav-item active"
                    : "admin-nav-item"
                }
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-role">
              <span>🔐</span>
              <div>
                <strong>Administrator</strong>
                <small>Full Access</small>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================================
            ADMIN CONTENT
        ========================================= */}

        <section className="admin-content">

          <AdminHeader activeSection={activeSection} />

          {activeSection === "overview" && (
            <Overview
              bookings={bookings}
              users={users}
              consultations={consultations}
              quotations={quotations}
              reviews={reviews}
            />
          )}

          {activeSection === "bookings" && (
            <Bookings
              bookings={bookings}
              updateBooking={updateBooking}
            />
          )}

          {activeSection === "consultations" && (
            <Consultations
              consultations={consultations}
              updateStatus={updateStatus}
              setModal={setModal}
            />
          )}

          {activeSection === "gallery" && (
            <GalleryManagement
              gallery={gallery}
              deleteItem={deleteItem}
              setModal={setModal}
            />
          )}

          {activeSection === "services" && (
            <ServicesManagement
              services={services}
              deleteItem={deleteItem}
              setModal={setModal}
            />
          )}

          {activeSection === "rentals" && (
            <RentalsManagement
              rentals={rentals}
              deleteItem={deleteItem}
              setModal={setModal}
            />
          )}

          {activeSection === "quotations" && (
            <QuotationsManagement
              quotations={quotations}
              updateStatus={updateStatus}
              setModal={setModal}
            />
          )}

          {activeSection === "reviews" && (
            <ReviewsManagement
              reviews={reviews}
              updateStatus={updateStatus}
              deleteItem={deleteItem}
            />
          )}

          {activeSection === "notifications" && (
            <NotificationsManagement
              notifications={notifications}
              deleteItem={deleteItem}
            />
          )}

          {activeSection === "customers" && (
            <Customers users={users} />
          )}

          {activeSection === "settings" && (
            <AdminSettings />
          )}

        </section>
      </div>

      {/* =========================================
          MODAL
      ========================================= */}

      {modal.type && (
        <AdminModal
          type={modal.type}
          item={modal.item}
          onClose={() =>
            setModal({
              type: null,
              item: null,
            })
          }
          onSaved={loadData}
        />
      )}
    </main>
  );
}

/* =========================================
   ADMIN HEADER
========================================= */

function AdminHeader({ activeSection }) {
  const titleMap = {
    overview: "Dashboard",
    bookings: "Bookings",
    consultations: "Consultation Requests",
    gallery: "Gallery Management",
    services: "Services Management",
    rentals: "Rentals Management",
    quotations: "Quotations",
    reviews: "Customer Reviews",
    notifications: "Notifications",
    customers: "Customers",
    settings: "Admin Settings",
  };

  return (
    <header className="admin-header">
      <div>
        <span className="eyebrow">✦ ADMIN PANEL ✦</span>

        <h1>
          {titleMap[activeSection] || "EventAura Management"}
        </h1>

        <p>
          Manage SM EventAura operations from one place.
        </p>
      </div>

      <div className="admin-header-badge">
        🔐 Administrator
      </div>
    </header>
  );
}

/* =========================================
   OVERVIEW
========================================= */

function Overview({
  bookings,
  users,
  consultations,
  quotations,
  reviews,
}) {
  const pendingBookings = bookings.filter(
    (x) => x.status === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (x) => x.status === "CONFIRMED"
  ).length;

  const pendingConsultations = consultations.filter(
    (x) =>
      x.status === "PENDING" ||
      x.status === "NEW"
  ).length;

  const pendingReviews = reviews.filter(
    (x) =>
      x.status === "PENDING" ||
      x.approved === false
  ).length;

  return (
    <>
      <div className="admin-stats">

        <StatCard
          icon="📅"
          value={bookings.length}
          label="Total Bookings"
        />

        <StatCard
          icon="⏳"
          value={pendingBookings}
          label="Pending Bookings"
        />

        <StatCard
          icon="✅"
          value={confirmedBookings}
          label="Confirmed Bookings"
        />

        <StatCard
          icon="👥"
          value={users.length}
          label="Customers"
        />

        <StatCard
          icon="💬"
          value={pendingConsultations}
          label="Consultations"
        />

        <StatCard
          icon="💰"
          value={quotations.length}
          label="Quotations"
        />

        <StatCard
          icon="⭐"
          value={pendingReviews}
          label="Pending Reviews"
        />

      </div>

      <div className="admin-grid-2">

        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Bookings</h2>
              <p>Latest customer booking activity.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <EmptyState message="No bookings available." />
          ) : (
            <div className="admin-list">
              {bookings.slice(0, 5).map((booking) => (
                <div className="admin-list-item" key={booking.id}>
                  <div>
                    <strong>
                      {booking.customerName || "Customer"}
                    </strong>

                    <span>
                      {booking.eventType || "Event"}
                    </span>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Business Overview</h2>
              <p>Current system activity.</p>
            </div>
          </div>

          <div className="overview-row">
            <span>Customers</span>
            <strong>{users.length}</strong>
          </div>

          <div className="overview-row">
            <span>Bookings</span>
            <strong>{bookings.length}</strong>
          </div>

          <div className="overview-row">
            <span>Consultations</span>
            <strong>{consultations.length}</strong>
          </div>

          <div className="overview-row">
            <span>Quotations</span>
            <strong>{quotations.length}</strong>
          </div>

          <div className="overview-row">
            <span>Reviews</span>
            <strong>{reviews.length}</strong>
          </div>
        </div>

      </div>
    </>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({ icon, value, label }) {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

/* =========================================
   BOOKINGS
========================================= */

function Bookings({ bookings, updateBooking }) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">
        <div>
          <h2>Booking Requests</h2>
          <p>Manage customer decoration bookings.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState message="No booking requests." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>

                  <td>
                    <strong>
                      {booking.customerName || "Customer"}
                    </strong>

                    <small>
                      {booking.customerEmail || ""}
                    </small>
                  </td>

                  <td>
                    {booking.eventType || "-"}
                  </td>

                  <td>
                    {booking.eventDate || "-"}
                  </td>

                  <td>
                    {booking.venue || "-"}
                  </td>

                  <td>
                    {booking.budget || "-"}
                  </td>

                  <td>
                    <StatusBadge status={booking.status} />
                  </td>

                  <td>
                    <select
                      value={booking.status || "PENDING"}
                      onChange={(e) =>
                        updateBooking(
                          booking.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="CONFIRMED">
                        Confirmed
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

/* =========================================
   CONSULTATIONS
========================================= */

function Consultations({
  consultations,
  updateStatus,
  setModal,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">
        <div>
          <h2>Consultation Requests</h2>
          <p>
            Review and manage customer consultation requests.
          </p>
        </div>
      </div>

      {consultations.length === 0 ? (
        <EmptyState message="No consultation requests available." />
      ) : (
        <div className="admin-table-wrap">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Date</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {consultations.map((item) => (
                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.customerName || item.name || "-"}
                    </strong>

                    <small>
                      {item.email || item.customerEmail || ""}
                    </small>
                  </td>

                  <td>
                    {item.eventType || "-"}
                  </td>

                  <td>
                    {item.eventDate || "-"}
                  </td>

                  <td>
                    {item.budget || "-"}
                  </td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="action-buttons">

                    <button
                      onClick={() =>
                        setModal({
                          type: "consultation",
                          item,
                        })
                      }
                    >
                      View
                    </button>

                    <select
                      value={item.status || "PENDING"}
                      onChange={(e) =>
                        updateStatus(
                          "/consultations",
                          item.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="APPROVED">
                        Approved
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>
                    </select>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

/* =========================================
   GALLERY MANAGEMENT
========================================= */

function GalleryManagement({
  gallery,
  deleteItem,
  setModal,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">

        <div>
          <h2>Gallery Management</h2>
          <p>
            Add and manage decoration photographs.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            setModal({
              type: "gallery",
              item: null,
            })
          }
        >
          + Add Image
        </button>

      </div>

      {gallery.length === 0 ? (
        <EmptyState
          message="No gallery items available."
        />
      ) : (
        <div className="admin-card-grid">

          {gallery.map((item) => (
            <div
              className="management-card"
              key={item.id}
            >

              {item.imageUrl || item.url ? (
                <img
                  src={item.imageUrl || item.url}
                  alt={item.title || "Decoration"}
                />
              ) : (
                <div className="image-placeholder">
                  🖼️
                </div>
              )}

              <div className="management-card-body">

                <h3>
                  {item.title || "Decoration Design"}
                </h3>

                <p>
                  {item.category || "Decoration"}
                </p>

                <div className="management-actions">

                  <button
                    onClick={() =>
                      setModal({
                        type: "gallery",
                        item,
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() =>
                      deleteItem(
                        "/gallery",
                        item.id,
                        item.title
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================
   SERVICES
========================================= */

function ServicesManagement({
  services,
  deleteItem,
  setModal,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">

        <div>
          <h2>Services Management</h2>
          <p>
            Manage decoration services offered by SM EventAura.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            setModal({
              type: "service",
              item: null,
            })
          }
        >
          + Add Service
        </button>

      </div>

      {services.length === 0 ? (
        <EmptyState message="No services available." />
      ) : (
        <div className="admin-card-grid">

          {services.map((service) => (
            <div
              className="management-card simple"
              key={service.id}
            >

              <div className="management-card-body">

                <span className="management-icon">
                  🛍️
                </span>

                <h3>
                  {service.name || "Service"}
                </h3>

                <p>
                  {service.description || "No description."}
                </p>

                {service.price && (
                  <strong>
                    ₹{service.price}
                  </strong>
                )}

                <div className="management-actions">

                  <button
                    onClick={() =>
                      setModal({
                        type: "service",
                        item: service,
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() =>
                      deleteItem(
                        "/services",
                        service.id,
                        service.name
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================
   RENTALS
========================================= */

function RentalsManagement({
  rentals,
  deleteItem,
  setModal,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">

        <div>
          <h2>Rentals Management</h2>
          <p>
            Manage decoration equipment and rental inventory.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            setModal({
              type: "rental",
              item: null,
            })
          }
        >
          + Add Rental
        </button>

      </div>

      {rentals.length === 0 ? (
        <EmptyState message="No rental items available." />
      ) : (
        <div className="admin-card-grid">

          {rentals.map((item) => (
            <div
              className="management-card simple"
              key={item.id}
            >

              <div className="management-card-body">

                <span className="management-icon">
                  🚜
                </span>

                <h3>
                  {item.name || "Rental Item"}
                </h3>

                <p>
                  {item.description || "No description."}
                </p>

                <p>
                  Availability:{" "}
                  <strong>
                    {item.available === false
                      ? "Unavailable"
                      : "Available"}
                  </strong>
                </p>

                <div className="management-actions">

                  <button
                    onClick={() =>
                      setModal({
                        type: "rental",
                        item,
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() =>
                      deleteItem(
                        "/rentals",
                        item.id,
                        item.name
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================
   QUOTATIONS
========================================= */

function QuotationsManagement({
  quotations,
  updateStatus,
  setModal,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">

        <div>
          <h2>Quotations</h2>
          <p>
            Create and manage customer quotations.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            setModal({
              type: "quotation",
              item: null,
            })
          }
        >
          + Create Quote
        </button>

      </div>

      {quotations.length === 0 ? (
        <EmptyState message="No quotations available." />
      ) : (
        <div className="admin-table-wrap">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {quotations.map((quote) => (
                <tr key={quote.id}>

                  <td>
                    {quote.customerName || "-"}
                  </td>

                  <td>
                    {quote.amount
                      ? `₹${quote.amount}`
                      : "-"}
                  </td>

                  <td>
                    {quote.createdAt?.slice?.(0, 10) || "-"}
                  </td>

                  <td>
                    <StatusBadge status={quote.status} />
                  </td>

                  <td>

                    <select
                      value={quote.status || "DRAFT"}
                      onChange={(e) =>
                        updateStatus(
                          "/quotations",
                          quote.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="DRAFT">
                        Draft
                      </option>

                      <option value="SENT">
                        Sent
                      </option>

                      <option value="ACCEPTED">
                        Accepted
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>
                    </select>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

/* =========================================
   REVIEWS
========================================= */

function ReviewsManagement({
  reviews,
  updateStatus,
  deleteItem,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">
        <div>
          <h2>Customer Reviews</h2>
          <p>
            Review and moderate customer feedback.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState message="No reviews available." />
      ) : (
        <div className="review-list">

          {reviews.map((review) => (
            <div
              className="review-admin-card"
              key={review.id}
            >

              <div>
                <h3>
                  {review.customerName ||
                    review.name ||
                    "Customer"}
                </h3>

                <div className="review-stars">
                  {"★".repeat(
                    Math.min(
                      Math.max(
                        Number(review.rating) || 0,
                        0
                      ),
                      5
                    )
                  )}
                </div>

                <p>
                  {review.comment ||
                    review.message ||
                    "No comment."}
                </p>
              </div>

              <div className="review-admin-actions">

                <StatusBadge status={review.status} />

                <select
                  value={
                    review.status ||
                    (review.approved
                      ? "APPROVED"
                      : "PENDING")
                  }
                  onChange={(e) =>
                    updateStatus(
                      "/reviews",
                      review.id,
                      e.target.value
                    )
                  }
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="APPROVED">
                    Approved
                  </option>

                  <option value="HIDDEN">
                    Hidden
                  </option>
                </select>

                <button
                  className="danger"
                  onClick={() =>
                    deleteItem(
                      "/reviews",
                      review.id,
                      "review"
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================
   NOTIFICATIONS
========================================= */

function NotificationsManagement({
  notifications,
  deleteItem,
}) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">

        <div>
          <h2>Notifications</h2>
          <p>
            Business notifications and system activity.
          </p>
        </div>

      </div>

      {notifications.length === 0 ? (
        <EmptyState message="No notifications available." />
      ) : (
        <div className="notification-list">

          {notifications.map((notification) => (
            <div
              className="notification-admin-card"
              key={notification.id}
            >

              <span className="notification-icon">
                🔔
              </span>

              <div>
                <strong>
                  {notification.title ||
                    "Notification"}
                </strong>

                <p>
                  {notification.message ||
                    "No message."}
                </p>

                <small>
                  {notification.createdAt
                    ?.slice?.(0, 16)
                    ?.replace("T", " ") || ""}
                </small>
              </div>

              <button
                className="danger"
                onClick={() =>
                  deleteItem(
                    "/notifications",
                    notification.id,
                    "notification"
                  )
                }
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================
   CUSTOMERS
========================================= */

function Customers({ users }) {
  return (
    <div className="admin-panel">

      <div className="panel-heading">
        <div>
          <h2>Customers</h2>
          <p>
            View registered customer accounts.
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState message="No customers found." />
      ) : (
        <div className="admin-table-wrap">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr key={user.id}>

                  <td>
                    <strong>
                      {user.name || "-"}
                    </strong>
                  </td>

                  <td>
                    {user.email || "-"}
                  </td>

                  <td>
                    {user.phone || "-"}
                  </td>

                  <td>
                    {user.createdAt
                      ?.slice?.(0, 10) || "-"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

/* =========================================
   SETTINGS
========================================= */

function AdminSettings() {
  return (
    <div className="admin-panel">

      <div className="panel-heading">
        <div>
          <h2>Admin Settings</h2>
          <p>
            Administrator account settings.
          </p>
        </div>
      </div>

      <div className="settings-grid">

        <div className="settings-card">
          <span>👤</span>
          <h3>Admin Profile</h3>
          <p>
            Manage administrator profile information.
          </p>

          <button>
            Edit Profile
          </button>
        </div>

        <div className="settings-card">
          <span>🔒</span>
          <h3>Password</h3>
          <p>
            Change the administrator password.
          </p>

          <button>
            Change Password
          </button>
        </div>

        <div className="settings-card">
          <span>🔔</span>
          <h3>Notifications</h3>
          <p>
            Configure administrator notifications.
          </p>

          <button>
            Notification Settings
          </button>
        </div>

      </div>

      <div className="admin-security-note">
        <strong>🔐 Security</strong>

        <p>
          Administrator access should always be protected
          by backend role verification. Do not expose
          administrator credentials in frontend code.
        </p>
      </div>

    </div>
  );
}

/* =========================================
   MODAL
========================================= */

function AdminModal({
  type,
  item,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    name: item?.name || "",
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "",
    price: item?.price || "",
    imageUrl: item?.imageUrl || item?.url || "",
    amount: item?.amount || "",
    customerName: item?.customerName || "",
  });

  const [saving, setSaving] = useState(false);

  const config = {
    gallery: {
      title: item
        ? "Edit Gallery Image"
        : "Add Gallery Image",
      endpoint: "/gallery",
    },

    service: {
      title: item
        ? "Edit Service"
        : "Add Service",
      endpoint: "/services",
    },

    rental: {
      title: item
        ? "Edit Rental"
        : "Add Rental",
      endpoint: "/rentals",
    },

    quotation: {
      title: item
        ? "Edit Quotation"
        : "Create Quotation",
      endpoint: "/quotations",
    },

    consultation: {
      title: "Consultation Details",
      endpoint: "/consultations",
    },
  };

  const current = config[type];

  const submit = async (event) => {
    event.preventDefault();

    if (type === "consultation") {
      onClose();
      return;
    }

    setSaving(true);

    try {
      const method = item ? "PUT" : "POST";

      await api(
        item
          ? `${current.endpoint}/${item.id}`
          : current.endpoint,
        {
          method,
          body: JSON.stringify(form),
        }
      );

      await onSaved();

      onClose();
    } catch (error) {
      alert(
        error.message ||
          "Unable to save this item."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="admin-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="admin-modal">

        <div className="modal-header">

          <h2>{current.title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {type === "consultation" ? (
          <div className="consultation-details">

            <InfoRow
              label="Customer"
              value={
                item?.customerName ||
                item?.name ||
                "-"
              }
            />

            <InfoRow
              label="Email"
              value={
                item?.email ||
                item?.customerEmail ||
                "-"
              }
            />

            <InfoRow
              label="Event"
              value={
                item?.eventType || "-"
              }
            />

            <InfoRow
              label="Date"
              value={
                item?.eventDate || "-"
              }
            />

            <InfoRow
              label="Budget"
              value={
                item?.budget || "-"
              }
            />

            <InfoRow
              label="Requirements"
              value={
                item?.requirements ||
                item?.message ||
                "-"
              }
            />

          </div>
        ) : (
          <form
            className="admin-form"
            onSubmit={submit}
          >

            {type === "gallery" && (
              <>
                <FormInput
                  label="Title"
                  value={form.title}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      title: value,
                    })
                  }
                  required
                />

                <FormInput
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      category: value,
                    })
                  }
                />

                <FormInput
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      imageUrl: value,
                    })
                  }
                  required
                />
              </>
            )}

            {type === "service" && (
              <>
                <FormInput
                  label="Service Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  required
                />

                <FormTextarea
                  label="Description"
                  value={form.description}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      description: value,
                    })
                  }
                />

                <FormInput
                  label="Price"
                  value={form.price}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      price: value,
                    })
                  }
                  type="number"
                />
              </>
            )}

            {type === "rental" && (
              <>
                <FormInput
                  label="Rental Item Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  required
                />

                <FormTextarea
                  label="Description"
                  value={form.description}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      description: value,
                    })
                  }
                />

                <FormInput
                  label="Rental Price"
                  value={form.price}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      price: value,
                    })
                  }
                  type="number"
                />
              </>
            )}

            {type === "quotation" && (
              <>
                <FormInput
                  label="Customer Name"
                  value={form.customerName}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      customerName: value,
                    })
                  }
                  required
                />

                <FormInput
                  label="Amount"
                  value={form.amount}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      amount: value,
                    })
                  }
                  type="number"
                  required
                />

                <FormTextarea
                  label="Description"
                  value={form.description}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      description: value,
                    })
                  }
                />
              </>
            )}

            <div className="modal-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : item
                  ? "Save Changes"
                  : "Create"}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

/* =========================================
   FORM COMPONENTS
========================================= */

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label className="admin-form-label">
      {label}

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}) {
  return (
    <label className="admin-form-label">
      {label}

      <textarea
        rows="4"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

/* =========================================
   HELPERS
========================================= */

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const value = status || "PENDING";

  return (
    <span
      className={`admin-status ${String(
        value
      ).toLowerCase()}`}
    >
      {value}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="admin-empty">
      <div>📭</div>
      <p>{message}</p>
    </div>
  );
}