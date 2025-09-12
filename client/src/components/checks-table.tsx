"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StatusBadge from "./status-badge";
import { IChecks } from "@/types";

const timeAgo = (dateString: Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
  return `${Math.floor(seconds)} second${seconds !== 1 ? "s" : ""} ago`;
};

const ChecksTable = ({ checks }: { checks: IChecks[] }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const checksPerPage = 10;

  const filteredChecks = useMemo(() => {
    let filtered = checks;

    if (statusFilter !== "all") {
      filtered = filtered.filter((check) => {
        const isSuccess = check.statusCode >= 200 && check.statusCode < 300;
        return statusFilter === "successful" ? isSuccess : !isSuccess;
      });
    }

    if (timeFilter !== "all") {
      const now = new Date();
      const timeLimit = new Date(now);
      if (timeFilter === "24h") {
        timeLimit.setDate(now.getDate() - 1);
      } else if (timeFilter === "7d") {
        timeLimit.setDate(now.getDate() - 7);
      } else if (timeFilter === "30d") {
        timeLimit.setDate(now.getDate() - 30);
      }
      filtered = filtered.filter(
        (check) => new Date(check.createdAt) >= timeLimit
      );
    }

    return filtered;
  }, [checks, statusFilter, timeFilter]);

  const totalPages = Math.ceil(filteredChecks.length / checksPerPage);
  const paginatedChecks = filteredChecks.slice(
    (currentPage - 1) * checksPerPage,
    currentPage * checksPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Checks History</CardTitle>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Status Code</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedChecks.length > 0 ? (
              paginatedChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>
                    <StatusBadge
                      status={
                        check.statusCode >= 200 && check.statusCode < 300
                          ? "UP"
                          : "DOWN"
                      }
                    />
                  </TableCell>
                  <TableCell>{check.statusCode}</TableCell>
                  <TableCell>{check.responseTime}ms</TableCell>
                  <TableCell>{timeAgo(check.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No checks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex w-full items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground w-full">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination className="w-full justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <PaginationPrevious />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <PaginationNext />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecksTable;
