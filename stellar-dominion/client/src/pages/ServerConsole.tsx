import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, Bug, Trash2, Download, RefreshCw } from 'lucide-react';

export default function ServerConsole() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, errors: 0, warnings: 0, info: 0, debug: 0 });
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'debug'>('all');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.level !== filter) return false;
    if (category && log.category !== category) return false;
    return true;
  });

  const categories = Array.from(new Set(logs.map((log) => log.category).filter(Boolean)));
  const categoryCounts = categories.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = logs.filter((log) => log.category === item).length;
    return acc;
  }, {});

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'debug': return <Bug className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warn': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'debug': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white';
    }
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'server-logs.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearLocalView = () => {
    setLogs([]);
    setStats({ total: 0, errors: 0, warnings: 0, info: 0, debug: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Server Console</h1>
          <p className="text-slate-400">Real-time monitoring and logging dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400 mt-1">Total Logs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/30 border-red-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                <div className="text-sm text-slate-400 mt-1">Errors</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/30 border-yellow-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.warnings}</div>
                <div className="text-sm text-slate-400 mt-1">Warnings</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/30 border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.info}</div>
                <div className="text-sm text-slate-400 mt-1">Info</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/30 border-gray-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">{stats.debug}</div>
                <div className="text-sm text-slate-400 mt-1">Debug</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex gap-2 flex-wrap">
            {['all', 'error', 'warn', 'info', 'debug'].map(f => (
              <Button
                key={f}
                onClick={() => setFilter(f as any)}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                className={filter === f ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
              >
                {f.toUpperCase()}
              </Button>
            ))}
            <Button onClick={fetchLogs} disabled={loading} size="sm" variant="outline" className="ml-auto">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={exportLogs} size="sm" variant="outline" className="text-slate-200 border-slate-600">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button onClick={clearLocalView} size="sm" variant="outline" className="text-red-300 border-red-600">
              <Trash2 className="w-4 h-4 mr-1" /> Clear View
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={category === '' ? 'default' : 'outline'}
              onClick={() => setCategory('')}
              className={category === '' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
            >
              All Categories
            </Button>
            {categories.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? 'default' : 'outline'}
                onClick={() => setCategory(item)}
                className={category === item ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
              >
                {item} ({categoryCounts[item] || 0})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Visible Logs</div>
              <div className="text-2xl font-bold text-white">{filteredLogs.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Selected Level</div>
              <div className="text-2xl font-bold text-white">{filter.toUpperCase()}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Selected Category</div>
              <div className="text-2xl font-bold text-white">{category || 'ALL'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Logs</CardTitle>
            <CardDescription>Last {filteredLogs.length} logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
              {filteredLogs.length === 0 ? (
                <div className="text-slate-400">No logs found</div>
              ) : (
                filteredLogs.slice().reverse().map((log, idx) => (
                  <div key={idx} className={`p-3 rounded border ${getLogColor(log.level)} flex gap-2 items-start`}>
                    <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
                    <div className="flex-grow min-w-0">
                      <div className="text-xs text-slate-500">{log.timestamp} • [{log.category}]</div>
                      <div className="text-slate-900 dark:text-white break-words">{log.message}</div>
                      {log.data && <div className="text-xs text-slate-600 mt-1">{JSON.stringify(log.data).substring(0, 100)}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
