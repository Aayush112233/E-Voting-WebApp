import {
  Avatar,
  Badge,
  Button,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import { HiOutlineCamera } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ImageUploading from "react-images-uploading";
import { cropImage } from "../../../config/cropUtils.js";
import Cropper from "react-easy-crop";
import { API } from "../../../baseUrlProvider";
import { toast } from "react-toastify";
import { fetchUserListService } from "../../../Services/authServices.js";

const ImageUploadingButton = ({ value, onChange, ...props }) => {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <IconButton>
          <HiOutlineCamera
            style={{
              fontSize: "25px",
              position: "absolute",
              backgroundColor: "white",
              borderRadius: "50%",
              color: "GrayText",
              // le
            }}
            color="primary"
            onClick={value ? onImageUpload : () => onImageUpdate(0)}
            {...props}
          />
        </IconButton>
      )}
    </ImageUploading>
  );
};

const ImageCropper = ({
  open,
  image,
  onComplete,
  containerStyle,
  handleSubmit,
  ...props
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>

      <DialogContent>
        <div style={containerStyle}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            {...props}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={() =>
            onComplete(cropImage(image, croppedAreaPixels, handleSubmit))
          }
        >
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const OverView = () => {
  const { userData } = useSelector((state) => state.userState);
  const [userInformation, setInfo] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData.userInfo) {
      setInfo(userData.userInfo);
      setPreview(userData.userInfo.profileImage);
    }
  }, [userData]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (image) => {
    const data = {
      image: image,
    };
    await API.post("/user/upload/" + userData.userInfo._id, data)
      .then((res) => {
        toast.success("Your Profile Picture is updated");
        dispatch(fetchUserListService());
      })
      .catch((err) => {
        toast.error("Failed to Update your profile.");
      });
  };

  return (
    <Grid container spacing={3} justifyContent={"center"}>
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection={"column"}
        alignItems="center"
      >
        <Badge
          overlap="circular"
          style={{ backgroundColor: "white" }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <ImageUploadingButton
              value={image}
              onChange={(newImage) => {
                setDialogOpen(true);
                setImage(newImage);
              }}
            />
          }
        >
          <Avatar
            alt="Remy Sharp"
            src={preview}
            sx={{
              width: {
                md: 150,
                xs: 100,
              },
              height: {
                md: 150,
                xs: 100,
              },
            }}
          />
        </Badge>

        <ImageCropper
          open={dialogOpen}
          image={image.length > 0 && image[0].dataURL}
          handleSubmit={handleSubmit}
          onComplete={(imagePromisse) => {
            imagePromisse.then((image) => {
              setPreview(image);
              setDialogOpen(false);
            });
          }}
          containerStyle={{
            position: "relative",
            width: "100%",
            height: 300,
            background: "#333",
          }}
        />

        <Typography
          mt={4}
          variant="body2"
          fontSize={{
            md: "20px",
            sm: "14px",
          }}
          fontWeight="bold"
        >
          {userInformation.firstName + " " + userInformation.lastName}
        </Typography>
        <Typography variant="body2" color={"GrayText"}>
          {userInformation.email}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <List sx={{ width: "100%", maxWidth: 1, bgcolor: "background.paper" }}>
          <ListItem sx={{ justifyContent: "space-between" }}>
            <ListItemText primary="Full Name : " />
            <ListItemText
              primary={
                userInformation.firstName + " " + userInformation.lastName
              }
              sx={{ textAlign: "end" }}
            />
          </ListItem>
          <Divider sx={{ width: "90%" }} component="li" />
          <ListItem>
            <ListItemText primary="Email : " />
            <ListItemText
              primary={userInformation.email}
              sx={{ textAlign: "end" }}
            />
          </ListItem>
          <Divider sx={{ width: "90%" }} component="li" />
          <ListItem>
            <ListItemText primary="Phone : " />
            <ListItemText
              primary={userInformation.contactInfo?.phoneNumber}
              sx={{ textAlign: "end" }}
            />
          </ListItem>
          <Divider sx={{ width: "90%" }} component="li" />
          <ListItem>
            <ListItemText primary="Permanent Address : " />
            <ListItemText
              primary={userInformation.contactInfo?.address.permanentAddress}
              sx={{ textAlign: "end" }}
            />
          </ListItem>
          <Divider sx={{ width: "90%" }} component="li" />
          <ListItem>
            <ListItemText primary="Temporary Address : " />
            <ListItemText
              primary={userInformation.contactInfo?.address.temporaryAddress}
              sx={{ textAlign: "end" }}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default OverView;
