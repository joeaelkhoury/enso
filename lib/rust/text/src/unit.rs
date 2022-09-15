//! Definition of strongly typed units, like `Line`, `CodePointIndex`, or `Location`. Used to
//! express type level dependencies in the whole library.

use crate::prelude::*;

use enso_types::newtype;
use enso_types::unit;



// ===============
// === Exports ===
// ===============

/// Common traits.
pub mod traits {
    pub use super::bytes::Into as TRAIT_bytes_into;
    pub use super::chars::Into as TRAIT_chars_into;
    pub use super::code_point_index::Into as TRAIT_column_into;
    pub use super::line::Into as TRAIT_line_into;
    pub use super::ubytes::Into as TRAIT_ubytes_into;
}
pub use traits::*;



// =============
// === Bytes ===
// =============

unit! {
/// An offset in the buffer in bytes.
Bytes::bytes(i32)
}

impl Bytes {
    /// Saturating conversion to `usize`.
    pub fn as_usize(self) -> usize {
        self.value.max(0) as usize
    }
}

impl<T: Into<Bytes>> bytes::Into for Range<T> {
    type Output = Range<Bytes>;
    fn bytes(self) -> Self::Output {
        let start = self.start.into();
        let end = self.end.into();
        Range { start, end }
    }
}

impl From<usize> for Bytes {
    fn from(t: usize) -> Self {
        (t as i32).into()
    }
}

impl From<&usize> for Bytes {
    fn from(t: &usize) -> Self {
        (*t as i32).into()
    }
}

impl From<UBytes> for Bytes {
    fn from(t: UBytes) -> Self {
        (t.value as i32).into()
    }
}

impl From<&UBytes> for Bytes {
    fn from(t: &UBytes) -> Self {
        (t.value as i32).into()
    }
}



// ==============
// === UBytes ===
// ==============

// FIXME: change to u32, just as rustybuzz does
unit! {
/// Unsigned bytes unit.
UBytes::ubytes(usize) NO_SUB
}

impl<T: Into<UBytes>> ubytes::Into for Range<T> {
    type Output = Range<UBytes>;
    fn ubytes(self) -> Self::Output {
        let start = self.start.into();
        let end = self.end.into();
        Range { start, end }
    }
}

impl Sub<UBytes> for UBytes {
    type Output = Bytes;
    fn sub(self, rhs: UBytes) -> Self::Output {
        (self.value as i32 - rhs.value as i32).into()
    }
}

impl Sub<Bytes> for UBytes {
    type Output = Bytes;
    fn sub(self, rhs: Bytes) -> Self::Output {
        (self.value as i32 - rhs.value).into()
    }
}

impl Sub<UBytes> for Bytes {
    type Output = Bytes;
    fn sub(self, rhs: UBytes) -> Self::Output {
        (self.value - rhs.value as i32).into()
    }
}

impl Add<Bytes> for UBytes {
    type Output = Bytes;
    fn add(self, rhs: Bytes) -> Self::Output {
        (self.value as i32 + rhs.value).into()
    }
}

impl Add<UBytes> for Bytes {
    type Output = Bytes;
    fn add(self, rhs: UBytes) -> Self::Output {
        (self.value + rhs.value as i32).into()
    }
}

#[derive(Debug, Clone, Copy)]
pub struct BytesToUBytesConversionError;

impl TryFrom<Bytes> for UBytes {
    type Error = BytesToUBytesConversionError;

    fn try_from(bytes: Bytes) -> Result<Self, Self::Error> {
        if bytes.value < 0 {
            Err(BytesToUBytesConversionError)
        } else {
            Ok(UBytes::from(bytes.value as usize))
        }
    }
}



// =============
// === Chars ===
// =============

// FIXME: use CodePointIndex instead
unit! {
/// An offset in the buffer in Rust's chars (being roughly the Unicode code points.
///
/// See [`crate`] documentation to know more about codepoints.
Chars::chars(i32)
}

impl Chars {
    /// Saturating conversion to `usize`.
    pub fn as_usize(self) -> usize {
        self.value.max(0) as usize
    }
}

impl<T: Into<Chars>> chars::Into for Range<T> {
    type Output = Range<Chars>;
    fn chars(self) -> Self::Output {
        let start = self.start.into();
        let end = self.end.into();
        Range { start, end }
    }
}

impl From<usize> for Chars {
    fn from(t: usize) -> Self {
        (t as i32).into()
    }
}

impl From<&usize> for Chars {
    fn from(t: &usize) -> Self {
        (*t as i32).into()
    }
}

impl serde::Serialize for Chars {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        i32::from(self).serialize(serializer)
    }
}

impl<'de> serde::Deserialize<'de> for Chars {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de> {
        i32::deserialize(deserializer).map(|val| val.into())
    }
}


// ============
// === Line ===
// ============

// FIXME: make Line usize and separate type for LineDiff - this should not be implemented for i32

// TODO: Improvement idea. Create `i32Saturated` type which will have all operations saturated.
//       This will make this unit safer.
unit! {
/// A type representing vertical measurements.
Line::line(i32)
}

impl Line {
    /// Saturating conversion to `usize`.
    pub fn as_usize(self) -> usize {
        self.value.max(0) as usize
    }

    /// Compute the absolute value of this line.
    pub fn abs(self) -> Self {
        self.value.saturating_abs().into()
    }
}

impl From<usize> for Line {
    fn from(t: usize) -> Self {
        (t as i32).into()
    }
}

impl From<&usize> for Line {
    fn from(t: &usize) -> Self {
        (*t as i32).into()
    }
}

// unit! {
//     ViewLine::view_line(usize)
// }

use std::ops::AddAssign;
use std::ops::SubAssign;

#[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd, From, Into)]
pub struct ViewLine {
    #[allow(missing_docs)]
    pub value: usize,
}

/// Smart constructor.
#[allow(non_snake_case)]
pub const fn ViewLine(value: usize) -> ViewLine {
    ViewLine { value }
}

impl From<&ViewLine> for ViewLine {
    fn from(t: &ViewLine) -> Self {
        *t
    }
}

impl From<&&ViewLine> for ViewLine {
    fn from(t: &&ViewLine) -> Self {
        **t
    }
}

impl From<f32> for ViewLine {
    fn from(t: f32) -> Self {
        if t < 0.0 {
            error!("Negative value used to construct ViewLine.");
            ViewLine(0)
        } else {
            ViewLine(t as usize)
        }
    }
}



impl Sub<ViewLine> for ViewLine {
    type Output = ViewLine;
    fn sub(self, rhs: ViewLine) -> Self::Output {
        if self.value < rhs.value {
            error!("Subtraction of ViewLine resulted in negative value.");
            ViewLine(0)
        } else {
            ViewLine(self.value - rhs.value)
        }
    }
}

impl Sub<ViewLine> for &ViewLine {
    type Output = ViewLine;
    fn sub(self, rhs: ViewLine) -> Self::Output {
        (*self).sub(rhs)
    }
}

impl Sub<&ViewLine> for ViewLine {
    type Output = ViewLine;
    fn sub(self, rhs: &ViewLine) -> Self::Output {
        self.sub(*rhs)
    }
}

impl Sub<&ViewLine> for &ViewLine {
    type Output = ViewLine;
    fn sub(self, rhs: &ViewLine) -> Self::Output {
        (*self).sub(*rhs)
    }
}

impl Add<ViewLine> for ViewLine {
    type Output = ViewLine;
    fn add(self, rhs: ViewLine) -> Self::Output {
        let value = self.value.add(rhs.value);
        ViewLine { value }
    }
}

impl Add<ViewLine> for &ViewLine {
    type Output = ViewLine;
    fn add(self, rhs: ViewLine) -> Self::Output {
        (*self).add(rhs)
    }
}

impl Add<&ViewLine> for ViewLine {
    type Output = ViewLine;
    fn add(self, rhs: &ViewLine) -> Self::Output {
        self.add(*rhs)
    }
}

impl Add<&ViewLine> for &ViewLine {
    type Output = ViewLine;
    fn add(self, rhs: &ViewLine) -> Self::Output {
        (*self).add(*rhs)
    }
}

#[allow(clippy::needless_update)]
impl AddAssign<ViewLine> for ViewLine {
    fn add_assign(&mut self, rhs: ViewLine) {
        self.value.add_assign(rhs.value)
    }
}

#[allow(clippy::needless_update)]
impl AddAssign<&ViewLine> for ViewLine {
    fn add_assign(&mut self, rhs: &ViewLine) {
        self.add_assign(*rhs)
    }
}

#[allow(clippy::needless_update)]
impl SubAssign<ViewLine> for ViewLine {
    fn sub_assign(&mut self, rhs: ViewLine) {
        *self = self.sub(rhs)
    }
}

#[allow(clippy::needless_update)]
impl SubAssign<&ViewLine> for ViewLine {
    fn sub_assign(&mut self, rhs: &ViewLine) {
        self.sub_assign(*rhs)
    }
}

impl ViewLine {
    pub fn inc(self) -> Self {
        self + ViewLine(1)
    }
}

// impl From<usize> for ViewLine {
//     fn from(t: usize) -> Self {
//         (t as i32).into()
//     }
// }
//
// impl From<&usize> for ViewLine {
//     fn from(t: &usize) -> Self {
//         (*t as i32).into()
//     }
// }

impl iter::Step for ViewLine {
    fn steps_between(start: &Self, end: &Self) -> Option<usize> {
        let diff = end.value - start.value;
        Some(diff)
    }

    fn forward_checked(start: Self, count: usize) -> Option<Self> {
        let new_value = start.value.checked_add(count)?;
        Some(ViewLine(new_value))
    }

    fn backward_checked(start: Self, count: usize) -> Option<Self> {
        let new_value = start.value.checked_sub(count)?;
        Some(ViewLine(new_value))
    }
}


unit! {
/// Unsigned bytes unit.
Column::column(usize)
}

impl<T: Into<Column>> column::Into for Range<T> {
    type Output = Range<Column>;
    fn column(self) -> Self::Output {
        let start = self.start.into();
        let end = self.end.into();
        Range { start, end }
    }
}



// ==============
// === CodePointIndex ===
// ==============

// TODO: Improvement idea. Create `i32Saturated` type which will have all operations saturated.
//       This will make this unit safer.
unit! {
CodePointIndex::code_point_index(i32)
}

impl CodePointIndex {
    /// Saturating conversion to `usize`.
    pub fn as_usize(self) -> usize {
        self.value.max(0) as usize
    }

    /// Compute the absolute value of this column.
    pub fn abs(self) -> Self {
        self.value.saturating_abs().into()
    }
}

impl From<usize> for CodePointIndex {
    fn from(t: usize) -> Self {
        (t as i32).into()
    }
}

impl From<&usize> for CodePointIndex {
    fn from(t: &usize) -> Self {
        (*t as i32).into()
    }
}



// ================
// === Location ===
// ================

auto trait NotSame {}
impl<T> !NotSame for (T, T) {}

mod location {
    use super::*;
    use std::ops::AddAssign;
    use std::ops::SubAssign;
    #[doc = " A type representing 2d measurements."]
    #[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd)]
    #[allow(missing_docs)]
    pub struct Location<Offset = UBytes, LineType = Line> {
        pub line:   LineType,
        pub offset: Offset,
    }

    impl<Offset, Line> Location<Offset, Line> {
        /// Line setter.
        pub fn with_line<Line2>(self, line: Line2) -> Location<Offset, Line2> {
            Location { line, offset: self.offset }
        }

        /// CodePointIndex setter.
        pub fn with_offset<Offset2>(self, offset: Offset2) -> Location<Offset2, Line> {
            Location { line: self.line, offset }
        }

        pub fn mod_line<Line2>(self, f: impl FnOnce(Line) -> Line2) -> Location<Offset, Line2> {
            let line = f(self.line);
            Location { line, offset: self.offset }
        }

        pub fn mod_offset<Offset2>(
            self,
            f: impl FnOnce(Offset) -> Offset2,
        ) -> Location<Offset2, Line> {
            let offset = f(self.offset);
            Location { line: self.line, offset }
        }

        pub fn zero_line(self) -> Location<Offset, Line>
        where Line: From<usize> {
            self.with_line(Line::from(0_usize))
        }

        pub fn zero_offset(self) -> Location<Offset, Line>
        where Offset: From<usize> {
            self.with_offset(Offset::from(0_usize))
        }

        pub fn inc_line(self) -> Location<Offset, <Line as Add>::Output>
        where Line: Add + From<usize> {
            self.mod_line(|t| t + Line::from(1_usize))
        }

        pub fn dec_line(self) -> Location<Offset, <Line as Sub>::Output>
        where Line: Sub + From<usize> {
            self.mod_line(|t| t - Line::from(1_usize))
        }


        pub fn inc_offset(self) -> Location<<Offset as Add>::Output, Line>
        where Offset: Add + From<usize> {
            self.mod_offset(|t| t + Offset::from(1_usize))
        }

        pub fn dec_offset(self) -> Location<<Offset as Sub>::Output, Line>
        where Offset: Sub + From<usize> {
            self.mod_offset(|t| t - Offset::from(1_usize))
        }
    }

    /// Smart constructor.
    #[doc = " A type representing 2d measurements."]
    #[allow(non_snake_case)]
    pub fn Location<Offset, Line>(line: Line, offset: Offset) -> Location<Offset, Line> {
        Location { line, offset }
    }

    impl<Offset: Copy, Line: Copy> From<&Location<Offset, Line>> for Location<Offset, Line> {
        fn from(t: &Location<Offset, Line>) -> Self {
            *t
        }
    }

    impl<Offset: Copy, Line: Copy> From<&&Location<Offset, Line>> for Location<Offset, Line> {
        fn from(t: &&Location<Offset, Line>) -> Self {
            **t
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset, Line: Add> Add<Line> for Location<Offset, Line> {
        type Output = Location<Offset, <Line as Add>::Output>;
        fn add(self, rhs: Line) -> Self::Output {
            Location { line: self.line.add(rhs), offset: self.offset }
        }
    }
    #[allow(clippy::needless_update)]
    impl<Offset: Copy, Line: Copy + Add> Add<Line> for &Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<Offset, <Line as Add>::Output>;
        fn add(self, rhs: Line) -> Self::Output {
            Location { line: self.line.add(rhs), offset: self.offset }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset: Add, Line> Add<Offset> for Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<<Offset as Add>::Output, Line>;
        fn add(self, rhs: Offset) -> Self::Output {
            Location { line: self.line, offset: self.offset.add(rhs) }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset: Copy + Add, Line: Copy> Add<Offset> for &Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<<Offset as Add>::Output, Line>;
        fn add(self, rhs: Offset) -> Self::Output {
            Location { line: self.line, offset: self.offset.add(rhs) }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset, Line: SaturatingAdd> SaturatingAdd<Line> for Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<Offset, <Line as SaturatingAdd>::Output>;
        fn saturating_add(self, rhs: Line) -> Self::Output {
            Location { line: self.line.saturating_add(rhs), offset: self.offset }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset: Copy, Line: Copy + SaturatingAdd> SaturatingAdd<Line> for &Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<Offset, <Line as SaturatingAdd>::Output>;
        fn saturating_add(self, rhs: Line) -> Self::Output {
            Location { line: self.line.saturating_add(rhs), offset: self.offset }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset: SaturatingAdd, Line> SaturatingAdd<Offset> for Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<<Offset as SaturatingAdd>::Output, Line>;
        fn saturating_add(self, rhs: Offset) -> Self::Output {
            Location { line: self.line, offset: self.offset.saturating_add(rhs) }
        }
    }

    #[allow(clippy::needless_update)]
    impl<Offset: Copy + SaturatingAdd, Line: Copy> SaturatingAdd<Offset> for &Location<Offset, Line>
    where (Offset, Line): NotSame
    {
        type Output = Location<<Offset as SaturatingAdd>::Output, Line>;
        fn saturating_add(self, rhs: Offset) -> Self::Output {
            Location { line: self.line, offset: self.offset.saturating_add(rhs) }
        }
    }
}
pub use location::*;



pub type ViewLocation<Offset = UBytes> = Location<Offset, ViewLine>;
