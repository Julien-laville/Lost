<?xml version="1.0" encoding="UTF-8"?>
<tileset name="sprite" tilewidth="32" tileheight="32" tilecount="32" columns="8">
 <image source="../../sprite.png" width="258" height="130"/>
 <tile id="0">
  <objectgroup draworder="index">
   <properties>
    <property name="sub" value=""/>
    <property name="width" type="int" value="2"/>
   </properties>
  </objectgroup>
 </tile>
 <tile id="1">
  <objectgroup draworder="index">
   <properties>
    <property name="name" value="sub"/>
   </properties>
  </objectgroup>
 </tile>
 <tile id="5">
  <objectgroup draworder="index">
   <properties>
    <property name="height" type="int" value="2"/>
    <property name="name" value="boss"/>
    <property name="width" type="int" value="3"/>
   </properties>
  </objectgroup>
 </tile>
 <tile id="15">
  <objectgroup draworder="index">
   <object id="1" x="0" y="0" width="32" height="32"/>
  </objectgroup>
 </tile>
 <tile id="22">
  <objectgroup draworder="index">
   <properties>
    <property name="name" value="powup"/>
   </properties>
  </objectgroup>
 </tile>
</tileset>
