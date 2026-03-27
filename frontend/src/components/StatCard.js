export default function StatCard({
    icon,
    title,
    value,
    subtitle
}) {

    return (

        <div className="stat-card">

            <div className="stat-header">
                <div className="stat-title">
                    {title}
                </div>

                <div className="stat-icon">
                    {icon}
                </div>
            </div>

            <div className="stat-value">
                {value}
            </div>

            {subtitle && (
                <div className="stat-sub">
                    {subtitle}
                </div>
            )}

        </div>

    );

}