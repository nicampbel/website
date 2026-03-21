

## DB Schema:

### **user**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **user_id** | SERIAL | PK | Unique identifier for each guest. |
| **name** | VARCHAR | NOT NULL | First name. |
| **surname** | VARCHAR | NOT NULL | Last name (or "+1" for unknown guests). |
| **category_id** | INT | FK | Links to `lookup_category`. |
| **email** | VARCHAR | Unique (Optional) | Guest email for notifications. |
| **phone** | VARCHAR | - | Contact number. |
| **plus_one_user_id**| INT | FK (Self) | ID of the linked partner/guest. |
| **rsvp_status_id** | INT | FK | Links to `lookup_rsvp_status`. |
| **dietary_req** | TEXT | - | Guest food allergies or preferences. |
| **song_request** | TEXT | - | Guest dance floor requests. |
| **created_at** | TIMESTAMPT | DEFAULT NOW() | When the record was created. |
| **updated_at** | TIMESTAMPT | DEFAULT NOW() | When the record was last changed. |

### **lookup_category**

| category_id | category |
| :---------- | :------- |
| 1          | family   |
| 2          | friend   |
| 3          | +1       |

### **lookup_rsvp_status**

| rsvp_status_id | category    |
| :------------- | :---------- |
| 1              | YES         |
| 2              | NO          |
| 3              | MAYBE       |
| 4              | NO RESPONSE |

### DDL

```sql
-- 1. Create Lookup Tables First
CREATE TABLE lookup_category (
    category_id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE lookup_rsvp_status (
    rsvp_status_id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL
);

-- 2. Create Main Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    category_id INT REFERENCES lookup_category(category_id),
    email VARCHAR(255),
    phone VARCHAR(20),
    plus_one_user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    rsvp_status_id INT REFERENCES lookup_rsvp_status(rsvp_status_id) DEFAULT 4,
    dietary_req TEXT,
    song_request TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Lookup Data
INSERT INTO lookup_category (category) VALUES ('family'), ('friend'), ('+1');
INSERT INTO lookup_rsvp_status (category) VALUES ('YES'), ('NO'), ('MAYBE'), ('NO RESPONSE');
```