'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, TextField, Typography, Stack, Button} from '@mui/material'
import { query, getDocs, collection, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id, 
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data() 
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
      bgcolor="#1E3A8A" // Dark blue background
      color="#FFFFFF" // White text
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" 
          top="50%"
          left="50%"
          width={400}
          bgcolor="#1E3A8A" // Dark blue background
          color="#FFFFFF" // White text
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{transform: 'translate(-50%, -50%)', borderRadius: '8px'}}
        >
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e)=>setItemName(e.target.value)}
              sx={{ bgcolor: '#FFFFFF', borderRadius: '4px' }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{ bgcolor: '#2563EB', color: '#FFFFFF' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={() => {
          handleOpen()
        }}
        sx={{ bgcolor: '#2563EB', color: '#FFFFFF' }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333" borderRadius="8px" p={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor="#3B82F6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h2" color="#FFFFFF">Inventory Items</Typography>
        </Box>
        <Stack 
          width="800px" 
          height="300px" 
          overflow="auto" 
          spacing={2}
          bgcolor="#1E40AF" // Dark blue background for list
          borderRadius="0 0 8px 8px"
          p={2}
        >
          {inventory.map(({name, quantity}) => (
            <Box 
              key={name} 
              width="100%" 
              minHeight="100px" 
              display="flex"
              alignItems="center" 
              justifyContent="space-between" 
              bgcolor='#2563EB' // Slightly lighter blue
              padding={2}
              borderRadius="8px"
            >
              <Typography variant="h4" color="#FFFFFF">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography> 
              <Typography variant="h4" color="#FFFFFF">{quantity}</Typography> 
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => {addItem(name)}} sx={{ bgcolor: '#4F46E5', color: '#FFFFFF' }}>Add</Button>
                <Button variant="contained" onClick={() => {removeItem(name)}} sx={{ bgcolor: '#EF4444', color: '#FFFFFF' }}>Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
