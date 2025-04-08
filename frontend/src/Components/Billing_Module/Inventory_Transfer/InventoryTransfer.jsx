import React, { useEffect, useState } from "react";
import "./InventoryTransfer.css";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchInventoryByShopAndBranch } from "../../../Redux/Slices/inventorySlice";
import { fetchShopById } from "../../../Redux/Slices/shopSlice";
import {
  createInventoryRequest,
  fetchRequestsByShop,
  updateRequestStatus,
} from "../../../Redux/Slices/inventoryRequestSlice";
import { BadgeCheck, XCircle, Hourglass } from "lucide-react";

export default function InventoryTransfer() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { shopId, branchId } = useParams();
  const dispatch = useDispatch();

  const shop = useSelector((state) => state.shops.currentShop);
  const requests = useSelector((state) => state.inventoryRequests.list);
  const items = useSelector((state) => state.inventory.list);

  const [filteredItems, setFilteredItems] = useState([]);
  const [from, setFrom] = useState({});
  const [request, setRequest] = useState({
    items: [],
    from: null,
    to: null,
  });
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchRequestsByShop(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    setFrom(shop?.branches?.find((branch) => branch._id === branchId));
    setRequest((prev) => ({ ...prev, from: from }));
  }, [shop, branchId, from]);

  useEffect(() => {
    dispatch(fetchInventoryByShopAndBranch({ shopId, branchId }));
  }, [dispatch, shopId, branchId]);

  useEffect(() => {
    console.log("Updated Request:", request);
  }, [request]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRequest({
      items: [],
      from: from,
      to: null,
    });
  };

  const handleChange = (e) => {
    setRequest((prev) => ({
      ...prev,
      to: e.target.value,
    }));
  };

  const handleSearchD = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const matches = items.filter((item) =>
        item["name"].toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(matches);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSelectItem = (item) => {
    if (!request.items.some((i) => i.inventoryId === item._id)) {
      setRequest((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            inventoryId: item._id,
            name: item.name,
            stock: item.stock,
            requestedQuantity: item.requestedQuantity || 1,
          },
        ],
      }));
    }
    setSearchTerm(""); // Clear input
    setFilteredItems([]); // Hide suggestions
  };

  const handleRemoveItem = (index) => {
    setRequest((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting request:", request);
    dispatch(
      createInventoryRequest({
        items: request.items,
        fromBranchId: request.from._id,
        toBranchId: request.to._id,
        shopId,
      })
    );
    dispatch(fetchRequestsByShop(shopId));
    handleClose();
  };

  const [selectedList, setSelectedList] = useState("received");
  const sentRequests = requests.filter((req) => req.fromBranchId === branchId);
  const receivedRequests = requests.filter(
    (req) => req.toBranchId === branchId
  );
  const [displayedRequests, setDisplayedRequests] = useState(receivedRequests);

  useEffect(() => {
    if (selectedList === "sent") {
      setDisplayedRequests(sentRequests);
    } else {
      setDisplayedRequests(receivedRequests);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList, requests]);

  const handleApprovedQuantityChange = (requestId, inventoryName, value) => {
    // console.log(requestId, inventoryName, value)
    setDisplayedRequests((prev) =>
      prev.map((req) =>
        req._id === requestId
          ? {
              ...req,
              items: req.items.map((item) =>
                item.inventoryId.name === inventoryName
                  ? { ...item, approvedQuantity: value }
                  : item
              ),
            }
          : req
      )
    );
    // console.log(displayedRequests)
  };

  const determineStatus = (req) => {
    const allApproved = req.items.every(
      (item) => Number(item.approvedQuantity) === item.requestedQuantity
    );
    const someApproved = req.items.some(
      (item) => Number(item.approvedQuantity) > 0
    );

    if (allApproved) return "Accepted";
    if (someApproved) return "Partially Accepted";
    return "Rejected";
  };

  // const handleStatusUpdate = (requestId) => {
  //
  //   setDisplayedRequests((prevRequests) => {
  //
  //     const requestToUpdate = prevRequests.find((req) => req._id === requestId);
  //     if (!requestToUpdate) return prevRequests; // Return early if not found

  //     // Compute the updated request with the new status
  //     const updatedRequest = {
  //       ...requestToUpdate,
  //       status: determineStatus(requestToUpdate)
  //     };

  //     // Dispatch update to backend with the correct data
  //     dispatch(updateRequestStatus({ id: requestId, updateData: updatedRequest }))
  //       .unwrap()
  //       .then(() => {
  //
  //         setDisplayedRequests((prev) =>
  //           prev.map((req) => (req._id === requestId ? updatedRequest : req))
  //         );

  //         // Fetch latest requests to ensure full consistency
  //         dispatch(fetchRequestsByShop(shopId));
  //       })
  //       .catch((error) => {
  //         console.error("Failed to update request:", error);
  //       });

  //     return prevRequests; // Ensure state updates properly
  //   });
  // };

  const handleStatusUpdate = (requestId) => {
    console.log("In Update");
    const requestToUpdate = displayedRequests.find(
      (req) => req._id === requestId
    );
    if (!requestToUpdate) return;

    const updatedRequest = {
      ...requestToUpdate,
      status: determineStatus(requestToUpdate),
    };

    dispatch(updateRequestStatus({ id: requestId, updateData: updatedRequest }))
      .unwrap()
      .then(() => {
        // Update UI after successful backend update
        setDisplayedRequests((prev) =>
          prev.map((req) => (req._id === requestId ? updatedRequest : req))
        );

        // Fetch latest requests for consistency
        dispatch(fetchRequestsByShop(shopId));
      })
      .catch((error) => {
        console.error("Failed to update request:", error);
      });
  };

  const textFieldStyles = {
    mb: 2,
    "& label": { color: "gray" }, // Default label color
    "& label.Mui-focused": { color: "gray" }, // Focused label color
    "& .MuiInputBase-input": { color: "gray" }, // Input text color
    "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
    "& .MuiFilledInput-underline:before": {
      borderBottomColor: "gray",
    }, // Default underline
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "gray",
    }, // Focused underline
  };
  const handleQuantityChange = (id, value) => {
    setRequest((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.inventoryId === id
          ? { ...item, requestedQuantity: Number(value) }
          : item
      ),
    }));
  };

  const getBranchNameById = (branchId) => {
    if (!shop || !shop.branches) return "Branch not found";

    const branch = shop.branches.find((branch) => branch._id === branchId);
    return branch ? branch.name : "-----";
  };

  const getAvailableStock = (itemName) => {
    const item = items.find((inv) => inv.name === itemName);
    return item ? item.stock : 0;
  };

  const statusConfig = {
    Pending: { label: "Pending", icon: <Hourglass size={20} /> },
    Accepted: { label: "Accepted", icon: <BadgeCheck size={20} /> },
    "Partially Accepted": {
      label: "Partially Accepted",
      icon: <ClipboardCheck size={20} />,
    },
    Rejected: { label: "Rejected", icon: <XCircle size={20} /> },
  };

  return (
    <div className="req-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "1.5rem",
        }}
      >
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            <FormControlLabel
              value="sent"
              control={<Radio sx={{ color: darkMode ? "white" : "black" }} />}
              label="Sent Requests"
            />
            <FormControlLabel
              value="received"
              control={<Radio sx={{ color: darkMode ? "white" : "black" }} />}
              label="Received Requests"
            />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={handleOpen}
          sx={{
            height: 40,
            backgroundColor: "#28a745",
            color: "white",
            "&:hover": {
              backgroundColor: "#218838",
            },
          }}
        >
          New Request
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          className="inventory-modal"
          sx={{
            "& .MuiDialog-container": {
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
            },
            "& .MuiPaper-root": {
              backgroundColor: darkMode ? "#222" : "#fff",
              color: darkMode ? "white" : "black",
              borderRadius: "12px",
              transition: "all 0.3s ease-in-out",
              height: "70vh",
              width: { xs: "95vw", sm: "90vw", md: "60vw" },
              padding: "20px",
              overflow: "auto", // Prevents scrollbars inside the modal
            },
            "& .MuiDialogContent-root": {
              overflow: "auto", // Hides scrollbars inside DialogContent
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
            },
          }}
        >
          <DialogTitle>New Inventory Request</DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              variant="filled"
              margin="dense"
              sx={textFieldStyles}
            >
              <InputLabel>To Branch</InputLabel>
              <Select
                name="to"
                value={request.to?.name}
                onChange={handleChange}
              >
                {shop?.branches?.map((branch) => (
                  <MenuItem key={branch._id} value={branch}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="manager"
              label="Item Name"
              type="text"
              fullWidth
              autoFocus
              variant="filled"
              value={searchTerm}
              onChange={handleSearchD}
              required
              error={request.item}
              helperText={request.item ? "Choose Atleast One Item." : ""}
              autoComplete="off"
              sx={textFieldStyles}
            />

            {/* Suggestions List */}
            {filteredItems.length > 0 && (
              <ul className="suggestion-list">
                {filteredItems.map((item, index) => (
                  <li key={index} onClick={() => handleSelectItem(item)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            )}

            {/* Selected Items List */}
            {request.items.length > 0 && (
              <div className="selected-items">
                <ul>
                  {request.items.map((item, index) => (
                    <li
                      key={item._id}
                      style={{ display: "flex", gap: "0.5rem", width: "100%" }}
                    >
                      <span
                        style={{
                          width: "45%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={item.requestedQuantity}
                        onChange={(e) =>
                          handleQuantityChange(item.inventoryId, e.target.value)
                        }
                        style={{ width: "15%", textAlign: "center" }}
                      />
                      <span style={{ width: "25%", textAlign: "center" }}>
                        In Stock: {item.stock}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        style={{ width: "15%" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
              sx={{
                backgroundColor: darkMode ? "#444" : "#f0f0f0",
                color: darkMode ? "white" : "black",
                "&:hover": {
                  backgroundColor: darkMode ? "#666" : "#ddd",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={!request.to || !request.items.length}
              sx={{
                backgroundColor: "#28a745",
                color: "white",
                "&:hover": {
                  backgroundColor: "#218838",
                },
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="requests-list">
        {displayedRequests.length > 0 ? (
          displayedRequests.map((req) => (
            <motion.div
              key={req.id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="card-content">
                <h2 className="transfer-header">
                  <span className="from">
                    {getBranchNameById(req.fromBranchId)}
                  </span>
                  <span className="arrow">➡</span>
                  <span className="to">
                    {getBranchNameById(req.toBranchId)}
                  </span>
                </h2>

                <table>
                  <thead>
                    <tr>
                      <th>Items</th>
                      <th>Requested</th>
                      {selectedList === "received" && <th>Approved</th>}
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {req.items.map((item, index) => {
                      const availableStock = getAvailableStock(
                        item.inventoryId.name
                      );
                      const isAvailable = availableStock > 0;
                      let isUpdated = 0;
                      if (
                        ["Accepted", "Rejected", "Partially Accepted"].includes(
                          req.status
                        )
                      ) {
                        isUpdated = 1;
                      }

                      return (
                        <tr key={index}>
                          <td>{item.inventoryId.name}</td>
                          <td>{item.requestedQuantity}</td>
                          {selectedList === "received" && (
                            <td>
                              <input
                                type="number"
                                max={Math.min(
                                  item.requestedQuantity,
                                  availableStock
                                )}
                                value={item.approvedQuantity}
                                disabled={!isAvailable || isUpdated}
                                onChange={(e) =>
                                  handleApprovedQuantityChange(
                                    req._id,
                                    item.inventoryId.name,
                                    e.target.value
                                  )
                                }
                                style={{ width: "50px" }}
                              />
                            </td>
                          )}
                          <td>{item.approvedQuantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {selectedList === "received" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "0.8rem",
                    }}
                  >
                    <button
                      className="status-btn"
                      onClick={() => handleStatusUpdate(req._id)}
                      disabled={[
                        "Accepted",
                        "Rejected",
                        "Partially Accepted",
                      ].includes(req.status)}
                      style={{
                        height: 40,
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        fontSize: "14px",

                        transition:
                          "background-color 0.2s ease-in-out, opacity 0.2s ease-in-out",
                        opacity: [
                          "Accepted",
                          "Rejected",
                          "Partially Accepted",
                        ].includes(req.status)
                          ? 0.6
                          : 1,
                        cursor: [
                          "Accepted",
                          "Rejected",
                          "Partially Accepted",
                        ].includes(req.status)
                          ? "not-allowed"
                          : "pointer",
                        "&:hover": {
                          backgroundColor: "#218838",
                        },
                      }}
                    >
                      Update
                    </button>
                  </div>
                )}

                <p
                  className="status"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {statusConfig[req.status]?.icon}
                  {statusConfig[req.status]?.label}
                </p>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="no-requests">No requests available.</p>
        )}
      </div>
    </div>
  );
}
