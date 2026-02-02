import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"

interface KPICardProps {
    title: string
    value: string | number
    subtitle: string
    trend: 'up' | 'down' | 'neutral'
    trendValue: string
    icon?: React.ElementType // Optional icon prop
}

export default function KPICard({ title, value, subtitle, trend, trendValue, icon: Icon }: KPICardProps) {
    const isPositive = trend === 'up';

    return (
        <Card className="shadow-premium border-none rounded-xl overflow-hidden relative group hover:shadow-lg transition-shadow bg-white">
            {/* Top Bar Decoration */}
            <div className={`absolute top-0 left-0 w-full h-1 ${isPositive ? 'bg-emerald-500' : 'bg-orange-500'}`} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5">
                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    {title}
                </CardTitle>
                {Icon ? (
                    <Icon className="h-6 w-6 text-emerald-800 opacity-80" />
                ) : (
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-3">
                    {value}
                </div>

                <div className="flex items-center gap-2">
                    <div className={`
              flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-bold
              ${isPositive
                            ? 'bg-emerald-100/80 text-emerald-800'
                            : 'bg-orange-100/80 text-orange-800'
                        }
           `}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trendValue}
                    </div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {subtitle}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
