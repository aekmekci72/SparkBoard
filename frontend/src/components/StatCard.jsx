function StatCard({ label, value, meta }) {
    return (
        <div className="stat-card">
            <p className="stat-label">
                {label}
            </p>

            <p className="stat-value">
                {value}
            </p>

            {meta && (
                <p className="stat-meta">
                    {meta}
                </p>
            )}
        </div>
    );
}

export default StatCard;
