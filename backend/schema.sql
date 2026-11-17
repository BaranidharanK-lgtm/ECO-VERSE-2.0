-- =====================================================================
-- EcoVerse AI: PostgreSQL Enterprise Relational Schema
-- Standard: PostgreSQL 14+ / 15+ / 16+
-- Platform: AI-Powered Sustainable Campus & Green Technology Platform
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    lead_person VARCHAR(150),
    contact_email VARCHAR(255),
    active_staff_count INT DEFAULT 0,
    open_tickets INT DEFAULT 0,
    avg_resolution_hours NUMERIC(5,2) DEFAULT 4.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE SET NULL,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campus Buildings Table
CREATE TABLE IF NOT EXISTS campus_buildings (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    floors INT NOT NULL DEFAULT 1,
    area_sq_ft NUMERIC(10,2) NOT NULL,
    solar_kw_peak NUMERIC(8,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Campus Specific Locations Table
CREATE TABLE IF NOT EXISTS campus_locations (
    id VARCHAR(50) PRIMARY KEY,
    building_id VARCHAR(50) REFERENCES campus_buildings(id) ON DELETE CASCADE,
    floor_number INT NOT NULL,
    room_number VARCHAR(50),
    zone_description TEXT,
    coord_x NUMERIC(5,2),
    coord_y NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sustainability Reports Table
CREATE TYPE issue_category_enum AS ENUM (
    'water', 
    'energy', 
    'waste', 
    'biodiversity', 
    'maintenance', 
    'other'
);

CREATE TYPE report_status_enum AS ENUM (
    'submitted',
    'ai_analysis',
    'awaiting_assignment',
    'assigned',
    'acknowledged',
    'in_progress',
    'awaiting_verification',
    'resolved',
    'reopened'
);

CREATE TYPE urgency_level_enum AS ENUM (
    'low', 
    'medium', 
    'high', 
    'critical'
);

CREATE TABLE IF NOT EXISTS sustainability_reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category issue_category_enum NOT NULL,
    building_id VARCHAR(50) REFERENCES campus_buildings(id) ON DELETE SET NULL,
    building_name VARCHAR(200) NOT NULL,
    location_details TEXT NOT NULL,
    coord_x NUMERIC(5,2),
    coord_y NUMERIC(5,2),
    image_url TEXT,
    date_observed TIMESTAMP WITH TIME ZONE NOT NULL,
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reporter_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    reporter_name VARCHAR(150) NOT NULL,
    reporter_role VARCHAR(50) NOT NULL,
    status report_status_enum DEFAULT 'submitted',
    assigned_department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    assigned_department_name VARCHAR(150),
    urgency urgency_level_enum DEFAULT 'medium',
    resolution_evidence_url TEXT,
    resolution_notes TEXT,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Evidence Files Table
CREATE TABLE IF NOT EXISTS evidence_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document'
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Department Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE CASCADE,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE CASCADE,
    assigned_technician_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    assigned_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. Report Status History Table (Audit Log)
CREATE TABLE IF NOT EXISTS report_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE CASCADE,
    status report_status_enum NOT NULL,
    actor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    comment TEXT,
    evidence_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE CASCADE,
    author_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notif_type VARCHAR(50) DEFAULT 'status_change',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Sensor Readings Table (Digital Twin Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    building_id VARCHAR(50) REFERENCES campus_buildings(id) ON DELETE CASCADE,
    sensor_type VARCHAR(100) NOT NULL, -- 'power_kw', 'bin_fullness_percent', 'lux', 'cfm_ventilation', 'aqi'
    sensor_code VARCHAR(50) NOT NULL,
    reading_value NUMERIC(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_simulated BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Digital Twin Objects Table
CREATE TABLE IF NOT EXISTS digital_twin_objects (
    id VARCHAR(50) PRIMARY KEY,
    object_type VARCHAR(50) NOT NULL, -- 'building', 'room', 'smart_bin', 'solar_array', 'sensor'
    name VARCHAR(200) NOT NULL,
    parent_building_id VARCHAR(50) REFERENCES campus_buildings(id) ON DELETE SET NULL,
    coord_x NUMERIC(5,2) NOT NULL,
    coord_y NUMERIC(5,2) NOT NULL,
    current_status VARCHAR(50) DEFAULT 'normal',
    telemetry_json JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AI Analysis Results Table (CV & LLM Predictions)
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) REFERENCES sustainability_reports(id) ON DELETE CASCADE,
    detected_category issue_category_enum NOT NULL,
    confidence_score NUMERIC(4,3) NOT NULL,
    suggested_urgency urgency_level_enum NOT NULL,
    suggested_department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    suggested_action TEXT NOT NULL,
    evidence_summary TEXT NOT NULL,
    requires_human_review BOOLEAN DEFAULT FALSE,
    visual_keywords TEXT[],
    model_version VARCHAR(50) DEFAULT 'ecovision-v2.4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Sustainability Metrics Historical Aggregations Table
CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL UNIQUE,
    energy_saved_kwh NUMERIC(12,2) DEFAULT 0,
    waste_diverted_kg NUMERIC(12,2) DEFAULT 0,
    co2e_avoided_kg NUMERIC(12,2) DEFAULT 0,
    water_conserved_liters NUMERIC(12,2) DEFAULT 0,
    issues_closed_count INT DEFAULT 0,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_reports_category ON sustainability_reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON sustainability_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_building ON sustainability_reports(building_id);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_dept ON sustainability_reports(assigned_department_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_type_time ON sensor_readings(sensor_type, recorded_at DESC);
